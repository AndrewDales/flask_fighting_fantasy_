// static/js/request

// gets data using the newer 'fetch' command
export async function getDataFetch(endpoint, callback) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const responseJSONData = await response.json();
        console.log(responseJSONData);
        callback(JSON.stringify(responseJSONData, null, "\t"))
    }
    catch (error) {
        console.error(error.message)
    }
}

// Send data using the 'fetch' command
export async function sendFormFetch(form, action, endpoint, callback){
    const formData = new FormData(form);
    const dataJSON = JSON.stringify(Object.fromEntries(formData));
    console.log(dataJSON);

    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    try {
        const response = await fetch(endpoint, {
            method: action,
            body: dataJSON,
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        const responseJSON = await response.json()
        console.log(responseJSON);
        callback(JSON.stringify(responseJSON), form)
    }
    catch (error){
            console.error('Fetch error:', error);
    }
}

// Send data to action api given it has already been formatted as JSON data
export async function sendJSONFetch(json_data, action, endpoint, callback){
            // Send the data as JSON
        fetch(endpoint,{
            method: action,
            headers: {
                'Content-Type': 'application/json'
            },
            body: json_data
            })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
            })
            .then(res => {
                callback(res);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}