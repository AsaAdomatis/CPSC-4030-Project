import pandas as pd
from geopy.geocoders import Nominatim
import sys

# getting command line arguments
if len(sys.argv) > 1:
    input_csv = sys.argv[1]
    chunk_size = int(sys.argv[2])
else:
    print("No input file provided.")

def generalize_shapes(row):
    shape = row['shape']
    if shape == 'changed':
        generalized = 'changing'
    elif shape == 'changing':
        generalized = 'changing'
    elif shape == 'chevron':
        generalized = 'shape'
    elif shape == 'cigar':
        generalized = 'pipe'
    elif shape == 'circle':
        generalized = 'circular'
    elif shape == 'cone':
        generalized = 'cone'
    elif shape == 'cross':
        generalized = 'cross'
    elif shape == 'cylinder':
        generalized = 'pipe'
    elif shape == 'delta':
        generalized = 'triangular'
    elif shape == 'diamond':
        generalized = 'quadrilateral'
    elif shape == 'disk':
        generalized = 'disk'
    elif shape == 'egg':
        generalized = 'circular'
    elif shape == 'fireball':
        generalized = 'illuminated'
    elif shape == 'flash':
        generalized = 'illuminated'
    elif shape == 'formation':
        generalized = 'formation'
    elif shape == 'light':
        generalized = 'illuminated'
    elif shape == 'other':
        generalized = 'misc'
    elif shape == 'oval':
        generalized = 'circular'
    elif shape == 'rectangle':
        generalized = 'quadrilateral'
    elif shape == 'round':
        generalized = 'circular'
    elif shape == 'sphere':
        generalized = 'circular'
    elif shape == 'teardrop':
        generalized = 'teardrop'
    elif shape == 'triangle':
        generalized = 'triangular'
    elif shape == 'unknown':
        generalized = 'misc'
    else:
        generalized = 'misc'

    return generalized

def calculate_counties(row):
    latitude = float(row['latitiude'])
    longitude = float(row['longitude'])
    geolocator = Nominatim(user_agent="Asa Adomatis", timeout=5)
    location = geolocator.reverse((latitude, longitude))
    
    if location and 'address' in location.raw:
        address = location.raw['address']
        if 'county' in address:
            return address['county']
    
    return "Unknown"

# running the additions
print('Beginning Program')
all_data = pd.DataFrame()

print('Beginning Chunk Processing')
for chunk in pd.read_csv(input_csv, chunksize=chunk_size):
    print('\tProcessing Chunk...')
    #chunk['generalizedShape'] = chunk.apply(generalize_shapes, axis=1)
    chunk['county'] = chunk.apply(calculate_counties, axis=1)
    print(chunk.head(10))
    # appending to overall data frame
    print('\tconcatenating...')
    all_data = pd.concat([all_data, chunk], ignore_index=True)
    print('Done!')
    print()

# saving final data
output_csv = "final-date.csv"
all_data.to_csv(output_csv, index=False)
