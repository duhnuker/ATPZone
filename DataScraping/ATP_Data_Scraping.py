from bs4 import BeautifulSoup
import pandas as pd
import requests
import sys
import re

all_finals_data = []  ## list to store all finals data

target_url = "https://en.wikipedia.org/wiki/List_of_Australian_Open_men%27s_singles_champions"

try:
    html_content = requests.get(target_url).text
    
    try:
        soup = BeautifulSoup(html_content, 'lxml')
    except Exception as e:
        print(f"Error: lxml parser not found or an issue occurred with it. Please ensure it's installed by running: pip install lxml. Details: {e}")
        # Stop execution if the parser is not available
        sys.exit() 

    # Find all tables with the classes 'sortable wikitable'
    all_championship_tables = soup.find_all('table', {'class': 'sortable wikitable'})

    table = None
    # The 'Open era' table is typically the second table with these classes (index 1)
    if len(all_championship_tables) > 1:
        # Select the second table
        table = all_championship_tables[1] 


    if table is None:
        print("Error: Could not find the 'Open era' table on the Wikipedia page.")
        print("Expected to find at least two tables with 'sortable wikitable' classes.")
    else:
        # Extract the table headers from the <thead> section
        headers = [th.get_text(strip=True) for th in table.find('tr').find_all('th')]
        
        # Header adjustments
        cleaned_headers = [
            "Year", 
            "Champion_Country", 
            "Champion", 
            "Runner_up_Country", 
            "Runner-up", 
            "Score_in_final"
        ]

        rows = []
        # Iterate through each table row, skipping the first row (headers)
        for tr in table.find_all('tr')[1:]:
            row_data = []
            # Extract data from each cell (td)
            cells = tr.find_all('td')
            
            # Check if the row has enough cells before accessing them
            if len(cells) < 6: # If a row has fewer than 6 cells, it's likely a special row (e.g., "No competition")
                continue # Skip this row and move to the next iteration

            # Year (first td)
            year = cells[0].get_text(strip=True)
            row_data.append(year)

            # Champion Country (second td)
            champion_country = cells[1].get_text(strip=True)
            row_data.append(champion_country)

            # Champion Name (third td) - extracts text from the <a> tag
            champion_name_tag = cells[2].find('a')
            champion_name = champion_name_tag.get_text(strip=True) if champion_name_tag else cells[2].get_text(strip=True)
            row_data.append(champion_name)

            # Runner-up Country (fourth td)
            runner_up_country = cells[3].get_text(strip=True)
            row_data.append(runner_up_country)

            # Runner-up Name (fifth td) - extract text from the <a> tag
            runner_up_name_tag = cells[4].find('a')
            runner_up_name = runner_up_name_tag.get_text(strip=True) if runner_up_name_tag else cells[4].get_text(strip=True)
            row_data.append(runner_up_name)

            # Score in the final (sixth td) - gets text and removes superscript references
            score = cells[5].get_text(strip=True)
            # Removes any bracketed references like '[14]' or '[b]'
            score = re.sub(r'\[.*?\]', '', score).strip()
            row_data.append(score)
            
            rows.append(row_data)
        
        # Pandas DataFrame with cleaned headers
        final_data_df = pd.DataFrame(rows, columns=cleaned_headers)
        all_finals_data.append(final_data_df)

except requests.exceptions.RequestException as e:
        print(f"Error: An error occurred during the request to {target_url}: {e}")
except Exception as e:
        print(f"Error: An unexpected error occurred: {e}")

if all_finals_data:
    stat_df = pd.concat(all_finals_data) ## concatenating all of the stats
    stat_df.to_csv("australian_open_men_singles_champions.csv", index=False)
    print("Data successfully saved to australian_open_men_singles_champions.csv")
else:
    print("No data was extracted.")