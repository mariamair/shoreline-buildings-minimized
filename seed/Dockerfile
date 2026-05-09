# Use official image as a base
FROM python:3.14-bookworm

# Create working directory
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir psycopg2-binary

# Copy seed script
COPY seed.py .

# Run the seed script
CMD ["python", "seed.py"]