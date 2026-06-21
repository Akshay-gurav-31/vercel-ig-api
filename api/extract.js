const instagramGetUrl = require("instagram-url-direct");

// Yeh Vercel ka Serverless Function hai. 
// Jab bhi koi /extract par POST request bhejega, yeh function chalega.
module.exports = async (req, res) => {
  // CORS Headers (taaki Android app se request aane par block na ho)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sirf POST request allow karenge
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Sirf POST requests allowed hain' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ status: 'error', message: 'URL dena zaroori hai' });
    }

    // Yahan hum NPM package (instagram-url-direct) ka use kar rahe hain.
    // Agar tumhara Render par apna koi custom code tha, toh tum use yahan paste kar sakte ho.
    let links = await instagramGetUrl(url);

    if (links && links.url_list && links.url_list.length > 0) {
      return res.status(200).json({
        status: 'ok',
        url: links.url_list[0], // Direct MP4 CDN URL
        title: "Instagram Reel",
        thumbnail: ""
      });
    } else {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Video link nahi nikal paya. Ya toh private account hai, ya Instagram ne block kiya.' 
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Server Error: ' + error.message 
    });
  }
};
