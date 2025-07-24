export async function POST(req) {
    try {
      const body = await req.json();
  
      // Decode Base64 email & password (optional)
      const decodedEmail = Buffer.from(body.email, 'base64').toString();
      const decodedPassword = Buffer.from(body.password, 'base64').toString();
  
      console.log('Received login request:');
      console.log('Email:', decodedEmail);
      console.log('Password:', decodedPassword);
      console.log('Token:', body.token);
  
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }