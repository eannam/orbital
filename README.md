# Orbital Technical Assessment Solution

## Submission by Éanna Morley

### Deployed Solution

A fully deployed solution that can be run in the browser is available at: <https://orbital-steel.vercel.app/>

This consists of a simple NextJS, React frontend for displaying the data with a FastAPI python backend.

The web app is deployed to Vercel and the API is deployed with Render.

API docs can be found at: <https://orbital-ia4z.onrender.com/docs>

If there is existing parsed data, you can remove it by clicking the 'Reset' button and run the solution again by clicking the 'Parse' button.

You can search the returned parsed data using the search bar provided.

### Quickstart

To run the solution, navigate to the `backend` folder and simply run:

`python solution.py`

To run unit tests, run:

`python -m unittest test.py`

### Overview of Solution

### Next Steps

* Optimise the performance of the list component in the web app. Due to the number of records, loading and rendering the data as well as searching is slow. Some approaches for doing this would be: Use a virtualised list for more performant rendering (e.g. `@tanstack/react-virtual`), implement cursor-based pagination with server-side searching capabilities.
* Implement the outstanding "Report Issue" feature whereby flagged records that have been improperly parsed can be sent to a LLM for fixing.
* Implement a proper database (e.g. `PostgreSQL`) for persisting and querying records.
* Implement API authentication.
* Build out a more comprehensive suite of unit tests.

### Additional Information

If you would like to run the web app locally:

* Start the API:
  * Navigate to `/backend`
  * Run `pip install -r requirements.txt`
  * Run `fastapi run main.py`
* Start the app:
  * Navigate to `/frontend`
  * Run `npm install`
  * Run `npm run dev`
  * Open `http://localhost:3000`
