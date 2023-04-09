// track view
export const trackView = (url = "") => {
  if (process.env.NODE_ENV === "development" || import.meta.env.VITE_DEV_MODE) {
    return console.log("trackView disabled");
  }
  umami.trackView(url);
};

// track action
export const trackAction = (action, params = {}) => {
  try {
    params = JSON.parse(JSON.stringify(params));
    if (
      process.env.NODE_ENV === "development" ||
      import.meta.env.VITE_DEV_MODE
    ) {
      //return console.log('trackAction disabled')
    }
    umami.trackEvent(action, params);
  } catch (err) {
    console.error('Fail to track action',{
        err,
        action,
        params
    })
  }
};
