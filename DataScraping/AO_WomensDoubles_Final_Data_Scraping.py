from bs4 import BeautifulSoup
import pandas as pd
import requests
import sys
import re
import pycountry

def convert_country_to_iso3(country_name):
    """Convert country name to 3-letter ISO code using pycountry"""
    if not country_name or country_name.strip() == "":
        return ""
    
    country_name = country_name.strip()
    
    # Special case conversions
    country_mapping = {
        "United States": "USA",
        "United Kingdom": "GBR",
        "Great Britain": "GBR",
        "England": "GBR",
        "Scotland": "GBR",
        "Wales": "GBR",
        "Northern Ireland": "GBR",
        "Russia": "RUS",
        "Soviet Union": "RUS",
        "USSR": "RUS",
        "Czech Republic": "CZE",
        "Czechoslovakia": "CZE",
        "Yugoslavia": "SRB",
        "West Germany": "DEU",
        "East Germany": "DEU",
        "Germany": "DEU",
        "South Korea": "KOR",
        "North Korea": "PRK",
        "Taiwan": "TWN",
        "Chinese Taipei": "TWN",
    }
    
    # Check if country is a special case
    if country_name in country_mapping:
        return country_mapping[country_name]
    
    try:
        country = pycountry.countries.lookup(country_name)
        return country.alpha_3
    except LookupError:
        try:
            # pycountry Fuzzy search for possible typos
            country = pycountry.countries.search_fuzzy(country_name)[0]
            return country.alpha_3
        except (LookupError, IndexError):
            print(f"Warning: Could not find ISO code for country: '{country_name}'")
            return country_name

def convert_countries_list_to_iso3(countries_string):
    """Convert comma-separated country names to comma-separated ISO codes"""
    if not countries_string or countries_string.strip() == "":
        return ""
    
    countries = [country.strip() for country in countries_string.split(",")]
    iso_codes = [convert_country_to_iso3(country) for country in countries]
    return ", ".join(iso_codes)

# Scraping start

ao_womensdoubles_finals_data = []  # List to store all finals data

target_url = "https://en.wikipedia.org/wiki/List_of_Australian_Open_women%27s_doubles_champions"

try:
    html_content = requests.get(target_url).text

    try:
        soup = BeautifulSoup(html_content, 'lxml')
    except Exception as e:
        print(f"Error: lxml parser not found or an issue occurred with it. Please ensure it's installed by running: pip install lxml. Details: {e}")
        sys.exit()

    # Find all tables with the classes 'sortable wikitable'
    all_championship_tables = soup.find_all('table', {'class': 'wikitable sortable'})

    table = None
    if len(all_championship_tables) > 2:
        table = all_championship_tables[2]

    if table is None:
        print("Error: Could not find the 'Australian Open' table on the Wikipedia page.")
        print("Expected to find at least two tables with 'sortable wikitable' classes.")
    else:
        cleaned_headers = [
            "Year",
            "Champions_Countries",
            "Champions",
            "Runners_up_Countries",
            "Runners-up",
            "Score_in_final"
        ]

        rows = []
        # Iterate through each table row, skipping the first row (headers)
        for tr in table.find_all('tr')[1:]:
            cells = tr.find_all('td')

            # Skip rows that are not data rows (e.g., "No competition" rows)
            if len(cells) < 4:
                continue

            row_data = []

            # Year
            year = cells[0].get_text(strip=True)
            row_data.append(year)

            # Champions and their Countries
            champions_countries = []
            champions_names = []
            
            # Find all flag images and player names in the Champions column (cells[1])
            for item in cells[1].children:
                if item.name == 'span' and 'flagicon' in item.get('class', []):
                    img_tag = item.find('img')
                    if img_tag and 'alt' in img_tag.attrs:
                        champions_countries.append(img_tag['alt'].strip())
                elif item.name == 'a' and item.get_text(strip=True):
                    champions_names.append(item.get_text(strip=True))
                elif item.name is None and item.strip():
                    pass

            # Convert country names to ISO3 codes
            champions_countries_iso = [convert_country_to_iso3(country) for country in champions_countries]
            row_data.append(", ".join(champions_countries_iso))
            row_data.append(", ".join(champions_names))

            # Runners-up and their Countries
            runner_up_countries = []
            runner_up_names = []
            
            # Find all flag images and player names in the Runners-up column (cells[2])
            for item in cells[2].children:
                if item.name == 'span' and 'flagicon' in item.get('class', []):
                    img_tag = item.find('img')
                    if img_tag and 'alt' in img_tag.attrs:
                        runner_up_countries.append(img_tag['alt'].strip())
                elif item.name == 'a' and item.get_text(strip=True):
                    runner_up_names.append(item.get_text(strip=True))
                elif item.name is None and item.strip():
                    pass
            
            # Convert country names to ISO3 codes
            runner_up_countries_iso = [convert_country_to_iso3(country) for country in runner_up_countries]
            row_data.append(", ".join(runner_up_countries_iso))
            row_data.append(", ".join(runner_up_names))

            # Score in the final (cells[3])
            score = cells[3].get_text(strip=True)
            
            # Removes any bracketed references like '[14]'
            score = re.sub(r'\[.*?\]', '', score).strip()
            row_data.append(score)

            rows.append(row_data)

        # Pandas DataFrame with cleaned headers
        ao_womensdoubles_final_data_df = pd.DataFrame(rows, columns=cleaned_headers)
        ao_womensdoubles_finals_data.append(ao_womensdoubles_final_data_df)

except requests.exceptions.RequestException as e:
    print(f"Error: An error occurred during the request to {target_url}: {e}")
except Exception as e:
    print(f"Error: An unexpected error occurred: {e}")

if ao_womensdoubles_finals_data:
    stat_df = pd.concat(ao_womensdoubles_finals_data)
    # Output to CSV
    stat_df.to_csv("australian_open_womens_doubles_finals_data.csv", index=False)
    print("Data successfully saved to australian_open_womens_doubles_finals_data.csv")
    print("\nFirst 5 rows of the DataFrame:")
    print(stat_df.head())
else:
    print("No data was extracted.")
