// static/js/request

// gets data using the newer 'fetch' command. This command can be used for an API endpoint that
// does not require any input parameters.
export async function getDataFetch(endpoint, callback) {
    try {
        const response = await fetch(endpoint)
        if (!response.ok) {
            console.error(`Response status: ${response.status}`)
            return;
        }
        const responseJSONData = await response.json()
        callback(responseJSONData)
    }
    catch (error) {
        console.error('Error:', error.message)}
    }


// Send data to action api given it has already been formatted as JSON data
export async function sendJSONFetch(json_data, action, endpoint, callback) {
  try {
    const options = {
      method: action,
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_data
    };

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    callback(responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}

