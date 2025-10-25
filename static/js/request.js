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



        // const responseJSONData = await response.json();
        // console.log(responseJSONData);
        // callback(JSON.stringify(responseJSONData, null, "\t"))
        // callback(response.json())
    // }
    // catch (error) {
    //     console.error(error.message)
    // }




// Send data to action api given it has already been formatted as JSON data
export async function sendJSONFetch(json_data, action, endpoint, callback) {
      try {
            const response = await fetch(endpoint, {
              method: action,
              headers: {
                'Content-Type': 'application/json'
              },
              body: json_data
            });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        callback(responseData);
      } catch (error) {
        console.error('Error:', error);
      }
    }

// // Send data using the 'fetch' command
// export async function sendFormFetch(form, action, endpoint, callback){
//     const formData = new FormData(form);
//     const dataJSON = JSON.stringify(Object.fromEntries(formData));
//     console.log(dataJSON);
//
//     // const myHeaders = new Headers();
//     // myHeaders.append("Content-Type", "application/json");
//     try {
//         const response = await fetch(endpoint, {
//             method: action,
//             body: dataJSON,
//             headers: {'Content-Type': 'application/json'}
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//
//
//         const responseJSON = await response.json()
//         console.log(responseJSON);
//         callback(JSON.stringify(responseJSON), form)
//     }
//     catch (error){
//             console.error('Fetch error:', error);
//     }
// }