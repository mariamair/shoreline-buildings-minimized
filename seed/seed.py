import os
import csv
import psycopg2
from psycopg2.extras import execute_values
import sys

def get_db_connection():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

def populate_reference_table(conn, csv_file):
    """Extract unique region values from CSV and insert into lookup table"""
    cur = conn.cursor()
    
    # Using sets to only store unique values. Note: Since sets are unordered in Python, the values in the reference table will not be in the same order as in the CSV.
    regions_set = set()
    
    # Extract unique values from CSV (streaming, doesn't load all rows)
    print("Extracting unique values from CSV...")
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:   
            # Only process rows where both 'byggnadstyp' and 'strandtyp' are 'totalt'
            byggnadstyp = row.get('byggnadstyp', '').strip()
            strandtyp = row.get('strandtyp', '').strip()
            if byggnadstyp != 'totalt' or strandtyp != 'totalt':
                continue

            region_str = row.get('region', '').strip()
            if region_str:
                regions_set.add(region_str)
    
    try:
        # Batch insert regions
        print(f"Inserting {len(regions_set)} regions...")
        region_data = []
        for region_str in regions_set:
            region_code, region_name = region_str.split(' ', 1)
            region_type = None
            if region_code:
                if region_code == "00":
                    region_type = 1
                    parent_code = None
                elif len(region_code) == 2:
                    region_type = 2
                    parent_code = "00"
                elif len(region_code) == 4:
                    region_type = 3
                    parent_code = region_code[:2]
                else:
                    print(f"  Warning: Could not set region_type for region_code '{region_code}'")
                region_data.append((region_code, region_name, region_type, parent_code))
            else:
                print(f"  Warning: Could not parse region '{region_str}'")
        
        if region_data:
            execute_values(
                cur,
                "INSERT INTO region (code, name, type_id, parent_code) VALUES %s ON CONFLICT (code) DO NOTHING",
                region_data,
                page_size=1000
            )
        
        conn.commit()
        print("✓ Reference table populated")
        
    except psycopg2.Error as e:
        conn.rollback()
        print(f"Error populating reference table: {e}")
        sys.exit(1)
    finally:
        cur.close()

def load_reference_data(conn):
    """Load lookup table into memory for mapping"""
    cur = conn.cursor()
    
    # Load regions (from CSV)
    cur.execute("SELECT code, name FROM region")
    regions = {row[1]: row[0] for row in cur.fetchall()}
    
    cur.close()
    
    return regions

def insert_building_count_batch(conn, csv_file, regions, batch_size=5000):
    """Insert shoreline building data in batches for better performance"""
    cur = conn.cursor()

    # Load the static reference table once
    cur.execute("SELECT id, name FROM area_type")
    area_types = {row[1]: row[0] for row in cur.fetchall()}
    
    try:
        batch_data = []
        row_count = 0
        skipped_rows = 0
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for idx, row in enumerate(reader, 1):
                try:
                    # Skip rows that don't match the filter
                    if row.get('byggnadstyp', '').strip() != 'totalt' or row.get('strandtyp', '').strip() != 'totalt':
                        continue

                    region_str = row.get('region', '').strip()
                    area_type_name = row.get('typ av område', '').strip()
                    year = int(row.get('år', 0))
                    count_str = row.get('Antal byggnader inom 100 meter från strand', '').strip()

                    # Parse building count: Replace .. and missing values with None (= NULL in database)
                    if count_str == '..':
                        count = None
                    elif count_str:
                        count = int(count_str)
                    else:
                        count = None
                    
                    # Parse region: Keep only the name part for looking up IDs in the next step: "01 Stockholms län" -> "Stockholms län"
                    region_name = None
                    if region_str and ' ' in region_str:
                        region_name = region_str.split(' ', 1)[1]
                    
                    # Look up IDs
                    region_code = regions.get(region_name) if region_name else None
                    area_type_id = area_types.get(area_type_name)
                    
                    batch_data.append((region_code, area_type_id, year, count))
                    row_count += 1
                    
                    # Insert when batch is full
                    if len(batch_data) >= batch_size:
                        execute_values(
                            cur,
                            """INSERT INTO building_count 
                               (region_code, area_type_id, year, count) 
                               VALUES %s""",
                            batch_data,
                            page_size=1000
                        )
                        conn.commit()
                        print(f"  Inserted {row_count} rows...")
                        batch_data = []
                    
                except ValueError as e:
                    print(f"  Error parsing row {idx}: {e}")
                    skipped_rows += 1
                    continue
            
            # Insert remaining batch
            if batch_data:
                execute_values(
                    cur,
                    """INSERT INTO building_count 
                        (region_code, area_type_id, year, count)
                       VALUES %s""",
                    batch_data,
                    page_size=1000
                )
                conn.commit()
        
        print(f"\n✓ Successfully inserted {row_count} rows into building_count")
        if skipped_rows > 0:
            print(f"  Skipped {skipped_rows} rows due to errors")
        
    except psycopg2.Error as e:
        conn.rollback()
        print(f"Error inserting data: {e}")
        sys.exit(1)
    finally:
        cur.close()

def load_building_data():
    """Main function to load shoreline building data"""
    csv_file = os.getenv('CSV_PATH', 'sample.csv')
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM building_count")
        count = cursor.fetchone()[0]
        cursor.close()
        
        if count > 0:
            print("Database already seeded, skipping.")
            return

        print(f"Reading CSV file: {csv_file}\n")
        
        print("Populating region reference table from CSV...")
        populate_reference_table(conn, csv_file)
        
        print("\nLoading reference data into memory...")
        regions = load_reference_data(conn)
        print(f"  Loaded {len(regions)} regions")
        
        print("\nInserting shoreline building data...")
        insert_building_count_batch(conn, csv_file, regions)
        
    finally:
        conn.close()

if __name__ == '__main__':
    load_building_data()