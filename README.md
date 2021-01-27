# Title

Workpatterns-Takehome

## Installation

To view this project do the following:
1. clone repo
2. npm install
3. Configure another email or json file if desired
4. npm start
5. If you aren't routed, view localhost:3000

### About this Project

This project was a take home for Workpatterns. The task was to create a view to see a user's Email Reply Time with other organizations and how it changes over time. I tried to limit myself to a few hours as the mentioned time frame for a MVP. I managed to get basic functionality and covered overall requirements but will work on unspecified features. 

I decided to define Email Response Time in minutes as that's the most realistic representation on a high level. 
The reason behind this is because many emails can be potentially answered within minutes/within the hour. I've also added an option change the time frame to remove outliers. The default is a reply within a month and can go down to a typical week or up to a year.

The table was made with material ui but could've been done with native html as well. 

Reason behind email change being an input was to show/use something different. It could have been a scraped list of emails within the JSON.

Things to consider/potential ideas:
1. ~~User input for any email for any given JSON file. This makes the task somewhat of an application as it current only displays data with a given hard coded email.~~ (Done)
2. ~~Years to be included rather than just 12 months. A single year could be displayed at any given time and I would paginate the rest.~~ (Done) 
3. A dropdown or button to change from minutes to other units of time. (Potential functionality)
4. Add a button to make email change more intuitive, rather than MVP
5. ~~Added time frame dropdown to select differnt options~~ (Done)
