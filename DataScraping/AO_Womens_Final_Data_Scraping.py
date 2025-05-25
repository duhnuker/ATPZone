from bs4 import BeautifulSoup
import pandas as pd
import requests
import sys
import re

ao_womens_finals_data = []

target_url = "https://en.wikipedia.org/wiki/List_of_Australian_Open_women%27s_singles_champions"

try:
    html_content = requests.get(target_url).text
    
    try:
        soup = BeautifulSoup(html_content, 'lxml')
    except Exception as e:
        print(f"Error: lxml parser not found or an issue occurred with it. Please ensure it's installed by running: pip install lxml. Details: {e}")
        sys.exit() 

    all_championship_tables = soup.find_all('table', {'class': 'sortable wikitable'})

    table = None
    if len(all_championship_tables) > 0:
        table = all_championship_tables[0] 


    if table is None:
        print("Error: Could not find the 'Open era' table on the Wikipedia page.")
        print("Expected to find at least two tables with 'sortable wikitable' classes.")
    else:
        headers = [th.get_text(strip=True) for th in table.find('tr').find_all('th')]
        
        cleaned_headers = [
            "Year", 
            "Champion_Country", 
            "Champion", 
            "Runner_up_Country", 
            "Runner-up", 
            "Score_in_final"
        ]

        rows = []
        for tr in table.find_all('tr')[1:]:
            row_data = []
            cells = tr.find_all('td')
            
            if len(cells) < 6:
                continue

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
        
        ao_womens_final_data_df = pd.DataFrame(rows, columns=cleaned_headers)
        ao_womens_finals_data.append(ao_womens_final_data_df)

except requests.exceptions.RequestException as e:
        print(f"Error: An error occurred during the request to {target_url}: {e}")
except Exception as e:
        print(f"Error: An unexpected error occurred: {e}")

if ao_womens_finals_data:
    stat_df = pd.concat(ao_womens_finals_data)
    stat_df.to_csv("australian_open_women_singles_champions.csv", index=False)
    print("Data successfully saved to australian_open_women_singles_champions.csv")
else:
    print("No data was extracted.")