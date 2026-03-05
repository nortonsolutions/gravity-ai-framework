const getOptions = () => {
  return {
    method: "GET",
  };
};

// Assumes Handlebars has been preloaded
const getTemplate = async (url) => {
  try {
    let response = await fetch(url, { ...getOptions(), cache: "no-cache" });
    let text = await response.text();
    let template = Handlebars.compile(text);
    return template;
  } catch (error) {
    throw error;
  }
};

const handleGet = async (url) => {
  try {
    let response = await fetch(url, { ...getOptions(), cache: "no-cache" });
    let text = await response.text();
    return text;
  } catch (error) {
    throw error;
  }
};

const getParamsFromRequest = (request) => {
  let { parameters } = request;

  let paramObj = {};

  if (request.parameters[0]) {
    for (let el of parameters) {
      let [name, value] = el.split("=");

      if (value) {
        value = value.replace(/\+/g, " ");
        paramObj[name] = value;
      } else {
        paramObj[name] = null;
      }
    }
  }
  return paramObj;
};

// Borrowed from D3 code
let shuffle = function (array, i0, i1) {
  if ((m = arguments.length) < 3) {
    i1 = array.length;
    if (m < 2) i0 = 0;
  }
  var m = i1 - i0,
    t,
    i;
  while (m) {
    i = (Math.random() * m--) | 0;
    (t = array[m + i0]), (array[m + i0] = array[i + i0]), (array[i + i0] = t);
  }
  return array;
};

