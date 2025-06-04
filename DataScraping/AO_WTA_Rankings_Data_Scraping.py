from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import traceback

ao_wta_rankings = []

target_urls = [
    "https://www.tennisabstract.com/cgi-bin/leaders_wta.cgi",
    "https://www.tennisabstract.com/cgi-bin/leaders_wta.cgi?players=51-100"
]

# As the table data is loaded and rendered after the initial page load -> selenium and chromedriver
DRIVER_PATH = r"F:\mainProjects\AOFever\DataScraping\chromedriver.exe"

chrome_options = Options()

# Run Chrome in headless mode
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36") # Add User-Agent

# service object for the ChromeDriver
service = Service(DRIVER_PATH)

# Driver init
driver = None

try:
    print("Starting WebDriver...")
    driver = webdriver.Chrome(service=service, options=chrome_options)
    print("WebDriver started.")

    # Loop through each target URL
    for url in target_urls:
        print(f"\n--- Processing URL: {url} ---")
        try:
            driver.get(url)

            print("Waiting for table to load...")
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "tablesorter"))
            )
            print("Table element found. Getting page source...")

            # Get the page source after JavaScript has rendered the table
            html_content = driver.page_source

            soup = BeautifulSoup(html_content, 'lxml')

            rankings_tables = soup.find_all('table', {'class': 'tablesorter'})

            table = None
            if rankings_tables:
                table = rankings_tables[0]

            if table is None:
                print(f"Error: Could not find the main 'tablesorter' table on {url}.")
                print("Skipping this URL and proceeding to the next if available.")
                continue # Skip to the next URL in the list

            cleaned_headers = [
                "Rank",
                "Player_Name",
                "Country_Code",
                "Total_Matches",
                "Win-Loss",
                "Win-Loss_Percentage",
                "Service_Points_Won_Percentage",
                "Ace_Rate_Percentage",
                "Double_Fault_Rate",
                "First_Serves_In_Percentage",
                "First_Serve_Points_Won_Percentage",
                "Second_Serve_Points_Won_Percentage",
                "Service_Games_Won_Percentage",
                "Points_Per_Service_Game",
                "Points_Lost_Per_Service_Game"
            ]

            # Temporary list for rows from the current URL
            rows_for_current_url = [] 

            for tr in table.find_all('tr')[1:]:
                cells = tr.find_all('td')

                if len(cells) < 19:
                    continue # Skip rows that don't have enough data cells

                row_data = []

                # Rank
                rank = cells[0].get_text(strip=True)
                row_data.append(rank)

                # Player Name and Country
                player_name = ''
                country_code = ''

                player_tag = cells[1].find('a')
                if player_tag:
                    player_name = player_tag.get_text(strip=True)

                all_spans_in_player_cell = cells[1].find_all('span')
                if len(all_spans_in_player_cell) >= 2:
                    country_text_with_brackets = all_spans_in_player_cell[1].get_text(strip=True)
                    country_code = country_text_with_brackets.strip('[]')

                row_data.append(player_name)
                row_data.append(country_code)

                # Total Matches
                total_matches_tag = cells[2].find('a')
                total_matches = total_matches_tag.get_text(strip=True) if total_matches_tag else ""
                row_data.append(total_matches)

                # Win-Loss
                win_loss = cells[3].get_text(strip=True)
                row_data.append(win_loss)

                # Win-Loss %
                win_loss_percentage = cells[4].get_text(strip=True)
                row_data.append(win_loss_percentage)

                # Service Points Won %
                service_points_won_percentage = cells[5].get_text(strip=True)
                row_data.append(service_points_won_percentage)

                # Ace Rate %
                ace_rate_percentage = cells[8].get_text(strip=True)
                row_data.append(ace_rate_percentage)

                # Double Fault Rate %
                double_fault_rate = cells[10].get_text(strip=True)
                row_data.append(double_fault_rate)

                # First Serves In %
                first_serves_in_percentage = cells[12].get_text(strip=True)
                row_data.append(first_serves_in_percentage)

                # First Serve Points Won %
                first_serve_points_won_percentage = cells[13].get_text(strip=True)
                row_data.append(first_serve_points_won_percentage)

                # Second Serve Points Won %
                second_serve_points_won_percentage = cells[14].get_text(strip=True)
                row_data.append(second_serve_points_won_percentage)

                # Service Games Won %
                service_games_won_percentage = cells[16].get_text(strip=True)
                row_data.append(service_games_won_percentage)

                # Points Per Service Game
                points_per_service_game = cells[17].get_text(strip=True)
                row_data.append(points_per_service_game)

                # Points Lost Per Service Game
                points_lost_per_service_game = cells[18].get_text(strip=True)
                row_data.append(points_lost_per_service_game)

                # Check for "partially empty" critical columns
                # Rank, Player_Name, Country_Code, Total_Matches
                critical_data_indices = [0, 1, 2, 3] 

                skip_current_row_data = False
                for index in critical_data_indices:
                    if not row_data[index]:
                        skip_current_row_data = True
                        print(f"Skipping row data in {url} due to empty critical data at index {index}: {row_data}")
                        break

                if skip_current_row_data:
                    continue

                # Add to the temporary list for this URL
                rows_for_current_url.append(row_data)

            current_url_df = pd.DataFrame(rows_for_current_url, columns=cleaned_headers)
            ao_wta_rankings.append(current_url_df)
            print(f"Successfully scraped {len(rows_for_current_url)} rows from {url}.")

        except Exception as e:
            print(f"Error processing URL {url}: {e}")
            # Print full traceback for unexpected errors
            traceback.print_exc()
            # Continue to the next URL in the loop even if this one fails
            continue

except Exception as e:
    print(f"Fatal error during WebDriver setup or overall process: {e}")
    traceback.print_exc()
finally:
    if driver:
        print("\nClosing chromedriver")
        driver.quit()
        print("chromedriver closed.")

if ao_wta_rankings:
    # Use ignore_index=True to reset DataFrame index
    stat_df = pd.concat(ao_wta_rankings, ignore_index=True)
    stat_df.to_csv("ao_wta_rankings_data.csv", index=False)
    print("\nAll data successfully saved to ao_wta_rankings_data.csv")
    print("\nFirst 5 rows of the combined DataFrame:")
    print(stat_df.head())
    print(f"\nTotal rows in combined DataFrame: {len(stat_df)}")
else:
    print("No data was extracted from any URL.")