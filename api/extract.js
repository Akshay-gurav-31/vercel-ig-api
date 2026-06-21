const instagramGetUrl = require("instagram-url-direct").default;

// This is a Vercel Serverless Function.
// It will be executed whenever a POST request is sent to /extract.
module.exports = async (req, res) => {
  // CORS Headers (to prevent requests from the Android app from being blocked)
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Only POST requests are allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ status: 'error', message: 'URL is required' });
    }

    // We are using the NPM package (instagram-url-direct) here.
    // If you had your own custom code on Render, you can paste it here instead.
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
        message: 'Could not extract video link. The account might be private or Instagram blocked the request.' 
      });
    }

  } catch (error) {
    let errMsg = error.message || error.error || JSON.stringify(error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Server Error: ' + errMsg 
    });
  }
};
