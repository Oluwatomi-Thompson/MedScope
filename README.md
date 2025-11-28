# MedScope

MedScope is a web application that allows users to search for medicines and access comprehensive information about them. The app fetches data from the OpenFDA API, displaying details such as brand name, generic name, manufacturer, purpose, dosage, usage instructions, active ingredients, and storage information. This application is designed to be intuitive and user-friendly, with a dark-themed interface and expandable sections for long texts.

---

## Features

- Search for medicines by **brand name**, **generic name**, or **substance name**.
- Handles **international drug names** by mapping them to US equivalents (e.g., Paracetamol → Acetaminophen).
- Displays:
  - Brand Name & Generic Name
  - Manufacturer
  - Purpose / Indications
  - Dosage & Administration
  - Active Ingredients
  - How to Use
  - Storage
- **Expandable sections** for long text.
- **Responsive design** suitable for desktops and tablets.
- **Autocomplete suggestion list** for 60+ common drugs.
- Dark-themed UI with soft text colors for readability.
- Clean, polished card-style layout for results.

---

## Technologies Used

- **HTML5 & CSS3** – Frontend structure and styling.
- **JavaScript (ES6)** – Fetching API data and interactive functionality.
- **OpenFDA API** – Source of medicine data.

---

## API Information

- **API Used:** [OpenFDA Drug Label API](https://open.fda.gov/apis/drug/label/)
- **Security:** Public API; no API key required.
- **Rate Limit:** Limited to 240 requests per minute. For this application, typical usage is well below this limit.
- **Credits:** Data provided by OpenFDA, U.S. Food & Drug Administration.

---

## Local Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/medscope.git
   cd medscope
   ```
2. Open index.html in your browser
3. Srart searching for medicines using the input box

## Deployment
MedScope has been deployed on two web servers with a load balancer distributing traffic between them. The application is fully functional through the load balancer, ensuring seamless access and consistent performance.

Access the live application with this op address: 54.88.20.208

## Deployment and Load balancer configuration

### 1. Server Deployment (Web01 and Web02)

The application code (index.html, style.css, script.js, and assets directory) was deployed to the default web root directory on both Web01 and Web02 using `scp`.

| Server | IP Address | Deployment Path |
| :--- | :--- | :--- |
| Web-server-1 | 34.239.101.93 | `/var/www/html/` |
| Web-server-2 | 54.204.209.124 | `/var/www/html/` |

**Deployment Steps:**

1.  Package the application files into a single archive (e.g., `medscope.zip`).
2.  Securely copy the files to the web servers:
    ```bash
    scp -r medscope/ user@34.239.101.93:/var/www/html/
    scp -r medscope/ user@54.204.209.124:/var/www/html/
    ```
3.  Verification: The application was confirmed to be running by accessing the URLs directly (e.g., `http://34.239.101.93/index.html`).

### 2. Load Balancer Configuration (Lb01)

The Load Balancer (Lb01) was configured using **Nginx** to distribute incoming traffic using a **Round Robin** algorithm, ensuring even distribution and high availability.

| Load Balancer | IP Address | Configuration |
| :--- | :--- | :--- |
| Load-balancer-1 | 54.88.20.208 | Nginx (Round Robin) |


## File Structure
MedScope/
│
├─ index.html           # Main HTML file
├─ style.css            # Stylesheet
├─ script.js            # JavaScript logic for API calls and UI
├─ assets/
│   ├─ pill.png         # Logo   
├─ README.md            # Project documentation

## Notes and Disclaimer
1. This application is for reference only. Always consult your healthcare provider before taking any medication.

2. While every effort was made to summarize and display information clearly, the data is fetched from a public FDA database.

3. If a search does not return results, try using a different brand, generic, or substance name.

## Challenges & Solutions

1. Challenge: Some international drug names are not recognized in OpenFDA.
    Solution: Implemented a mapping table (drugNameMap) to convert common international names to US equivalents.

2. Challenge: Long texts from the API were overwhelming for users.
    Solution: Added expandable sections with "Show more / Show less" buttons to summarize content.

3. Challenge: Users needed to search multiple times without refreshing.
    Solution: Implemented dynamic DOM updates to remove old search results before displaying new ones.



## Web servers
1. Web-server-1: 34.239.101.93
2. Web-server-2: 54.204.209.124
3. Load-balancer-1: 54.88.20.208

## Demo Video
A demo video showcasing the application, features, and usage via the load balancer is available at:
https://youtu.be/jxU03575fHQ

## Credits
1. OpenFDA – U.S. Food & Drug Administration, OpenFDA Drug Label API

2. Fonts – Google Fonts Inter

3. Icons – Custom pill icon in /assets/pill.png

## License
This project is for academic purposes only. All code is written by the author.

