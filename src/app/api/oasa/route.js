// pages/api/route.js

//FOR fetch api post reqs
// fetch("http://example.com/api/endpoint/", {
//   method: "post",
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },

//   //make sure to serialize your JSON body
//   body: JSON.stringify({
//     name: myName,
//     password: myPassword
//   })
// })
// .then( (response) => { 
//    //do something awesome that makes the world a better place
// });
/////////////////////////////////////////////

export async function GET(request) {
  try {
    const act = request?.nextUrl?.searchParams.get('act')
    const p1 = request?.nextUrl?.searchParams.get('p1')
    const p2 = request?.nextUrl?.searchParams.get('p2')
    const p3 = request?.nextUrl?.searchParams.get('p3')
    const p4 = request?.nextUrl?.searchParams.get('p4')

    const line_code = request?.nextUrl?.searchParams.get('line_code') // only for act=getDailySchedule. What a nice api...

    const externalRes = await fetch(`http://telematics.oasa.gr/api/?act=${act}&p1=${p1}&p2=${p2}&p3=${p3}&p4=${p4}&line_code=${line_code}`);

    console.log(`http://telematics.oasa.gr/api/?act=${act}&p1=${p1}&p2=${p2}&p3=${p3}&p4=${p4}&line_code=${line_code}`)

    if (!externalRes.ok)
      throw new Error(`External API error: ${externalRes.status}`);

    const data = await externalRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API route error:', error);

    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


// const getLineByCode = async () => {
//   console.log('getting all lines: ')
//   let response;
//   try {
//     response = await axios.get(
//       "/api/?act=webGetLines"
//     );
//   } catch (err) {
//     console.log(err);
//   }

//   if (response?.data) {
//     return response.data;
//   }

//   return response;
// };

// const getLineLocations = async (routeCode) => {
//   console.log('getting locations with  route code: ', routeCode)
//   let response;
//   try {
//     response = await axios.post(`/api/?act=getBusLocation&p1=${routeCode}`)
//   } catch (err) {
//     console.log(err);
//   }

//   // console.log(response)
//   return response;

//   // if (response?.data) {
//   //   const lineData = response.data.filter(itm => itm.LineID === code );
//   //   // console.log(lineData);
//   //   return lineData;
//   // }
// }

// const getLineRoutes = async (lineCode) => {
//   console.log('getting routes of line with code: ', lineCode)
//   let response;
//   try {
//     response = await axios.post(`/api/?act=webGetRoutes&p1=${lineCode}`)
//   } catch (err) {
//     console.log(err);
//   }

//   // console.log(response)
//   return response;
// }

// export { getLineByCode, getLineLocations, getLineRoutes };
