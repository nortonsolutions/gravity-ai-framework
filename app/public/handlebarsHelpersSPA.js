export const registerHelpers = (hbs) => {

    // Output a value as a safe JSON string (use inside <script type="application/json"> blocks)
    hbs.registerHelper('json', function(value) {
        return new hbs.SafeString(JSON.stringify(value ?? null));
    });

    hbs.registerHelper("booleanCheckboxHelper", function(boolean) {
        let str = "";
        if (boolean) str = "checked";
        return new hbs.SafeString(str);
      });
    
    hbs.registerHelper("plusOne", function(value) {
        return value+1;
    });

    hbs.registerHelper("limitLength", function(string) {
        if (!string) return '';
        if (string.length > 22) {
            return (string.substring(0,22) + '...');
        } else return string;
    });

    hbs.registerHelper("chooseOne", function(string1, string2, option1, option2) {
        // condition is a comparison operation in a string, e.g. "questionNumber == 1"
        if (string1 === string2) {
            return option1;
        } else {
            return option2;
        } 
    });

    hbs.registerHelper("hideButton", function(button, currentQuestionNumber, totalQuestions) {
        switch (button) {
            case 'previous':
                if (
                    currentQuestionNumber == 1) return 'd-none'; 
                break;
            case 'next':
                if (currentQuestionNumber == totalQuestions) return 'd-none';  
                break;
            case 'done':
                if (currentQuestionNumber != totalQuestions) return 'd-none'; 
                break;
        }
        return '';

    });

    hbs.registerHelper("disabledIf", function(boolean) {
        let str = '';
        if (boolean) str = "disabled";
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("hideIf", function(boolean) {
        let str = '';
        if (boolean) str = "d-none";
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("hideIfNot", function(boolean) {
        let str = '';
        if (!boolean) str = "d-none";
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("hideIfNotEqual", function(string1, string2, string3) {
        let str = '';
        if (string1 != string2) {
            if (string3) {
                if (string1 != string3) str = "d-none";
            } else {
                str = "d-none";
            }
        }
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("hideIfEqual", function(string1, string2, string3) {
        let str = '';
        if (string1 == string2) {
            if (string3) {
                if (string1 == string3) str = "d-none";
            } else {
                str = "d-none";
            }
        }
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("selectedIfEqual", function(string1, string2, string3) {
        let str = '';
        if (string1 == string2 || string1 == string3) str = "selected";
        return new hbs.SafeString(str);
    });

    hbs.registerHelper("shortDate", function(date) {
        return date.toLocaleDateString();
    });

    hbs.registerHelper("jsDate", function(date) {
        var formatter = new Intl.DateTimeFormat('en-us', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

        let [{value: month},,{value: day},,{value: year}] = formatter.formatToParts(date);
        return year + "-" + month + "-" + day;
    });

    hbs.registerHelper("calculateRows", function(string) {
        if (!string || string.length == 0) return 4;
        return Math.ceil(string.length / 45);
    });
    
    hbs.registerHelper("calculateRowsShort", function(string) {
        if (!string || string.length == 0) return 2;
        return Math.ceil(string.length / 37);
    });

    hbs.registerHelper("correctOrIncorrrect", function(correct) {
        let str = '';
        if (correct) { 
            str = '<strong style="color: green">Correct!</strong>';
        } else {
            str = '<strong style="color: red">Incorrect</strong>';
        }

        return new hbs.SafeString(str);
    });

    hbs.registerHelper("selectedForRole", function(roles, role) {
        if (roles && roles.includes(role)) {
            return 'selected';
        } else return '';
    });

    hbs.registerHelper("divide", function(one, two) {
        return one / two * 100;
    });
    
    hbs.registerHelper("reportedHelper", function(reported) {
        return reported? 'reported' : '';
    });

    hbs.registerHelper("secondsToMMSS", function(seconds) {
        return Math.floor(seconds/60) + ":" + (seconds%60).toLocaleString("en-US", { minimumIntegerDigits: 2 });
    });

    hbs.registerHelper("homeContentHelper", function(homeContent) {
        return new hbs.SafeString(homeContent);
    });

    hbs.registerHelper("or", function(a, b) {
        return a || b;
    });

    hbs.registerHelper("eq", function(a, b) {
        return a === b;
    });

    // Block helper for if equal
    hbs.registerHelper("if_eq", function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // Block helper for unless equal  
    hbs.registerHelper("unless_eq", function(a, b, options) {
        if (a !== b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    hbs.registerHelper("formatFileSize", function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    });

    hbs.registerHelper("formatDate", function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    // Substring helper for truncating text
    hbs.registerHelper("substring", function(str, start, end) {
        if (!str) return '';
        return str.substring(start, end);
    });

    // ifEquals block helper
    hbs.registerHelper("ifEquals", function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // Block helper for if_or - returns true if either condition is true
    hbs.registerHelper("if_or", function(a, b, options) {
        if (a || b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // Block helper for if_and - returns true if both conditions are true
    hbs.registerHelper("if_and", function(a, b, options) {
        if (a && b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // NOT
    hbs.registerHelper("not", function(value) {
        return !value;
    });

    // Truncate helper for limiting text length
    hbs.registerHelper("truncate", function(str, length) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });

    // Add helper for math
    hbs.registerHelper("add", function(a, b) {
        return a + b;
    });

    // Multiply helper for calculations
    hbs.registerHelper("multiply", function(a, b) {
        return (a * b).toFixed(2);
    });

    // Comparison helpers
    hbs.registerHelper("lt",  function(a, b) { return a <  b; });
    hbs.registerHelper("lte", function(a, b) { return a <= b; });
    hbs.registerHelper("gt",  function(a, b) { return a >  b; });
    hbs.registerHelper("gte", function(a, b) { return a >= b; });

    // Year helper for copyright
    hbs.registerHelper("year", function() {
        return new Date().getFullYear();
    });

    hbs.registerHelper("urlEncode", function(str) {
        if (!str) return '';
        return new hbs.SafeString(encodeURIComponent(str));
    });

    // Increment helper - adds 1 to a number  
    hbs.registerHelper("inc", function(value) {
        return (value || 0) + 1;
    });

    // Range helper - generates array of numbers (for loops)
    hbs.registerHelper("range", function(start, end) {
        if (end === undefined) {
            end = start;
            start = 0;
        }
        let result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    });

  hbs.registerHelper("iconize", function (data) {
    let str;

    switch (data) {
      case "male":
        str = "<i class='fas fa-male'></i>";
        break;
      case "female":
        str = "<i class='fas fa-female'></i>";
        break;
      default:
        str = "?";
    }
    return new hbs.SafeString(str);
  });

  hbs.registerHelper("booleanCheckboxHelper", function (boolean) {
    let str = "";
    if (boolean) str = "checked";
    return new hbs.SafeString(str);
  });

  hbs.registerHelper("plusOne", function (value) {
    return value + 1;
  });

  hbs.registerHelper("limitLength", function (string) {
    if (string.length > 22) {
      return string.substring(0, 22) + "...";
    } else return string;
  });

  hbs.registerHelper(
    "hideButton",
    function (button, currentElementNumber, totalElements) {
      switch (button) {
        case "previous":
          if (currentElementNumber == 1) return "d-none";
          break;
        case "next":
          if (currentElementNumber == totalElements) return "d-none";
          break;
        case "done":
          if (currentElementNumber != totalElements) return "d-none";
          break;
      }
      return "";
    }
  );

  hbs.registerHelper("disabledIf", function (boolean) {
    let str = "";
    if (boolean) str = "disabled";
    return new hbs.SafeString(str);
  });

  hbs.registerHelper("hideIf", function (boolean) {
    let str = "";
    if (boolean) str = "d-none";
    return new hbs.SafeString(str);
  });

  hbs.registerHelper("hideIfNot", function (boolean) {
    let str = "";
    if (!boolean) str = "d-none";
    return new hbs.SafeString(str);
  });

  hbs.registerHelper(
    "hideIfNotEqual",
    function (string1, string2, string3) {
      let str = "";
      if (string1 != string2) {
        if (string3) {
          if (string1 != string3) str = "d-none";
        } else {
          str = "d-none";
        }
      }
      return new hbs.SafeString(str);
    }
  );

  hbs.registerHelper(
    "hideIfEqual",
    function (string1, string2, string3) {
      let str = "";
      if (string1 == string2) {
        if (string3) {
          if (string1 == string3) str = "d-none";
        } else {
          str = "d-none";
        }
      }
      return new hbs.SafeString(str);
    }
  );

  hbs.registerHelper(
    "selectedIfEqual",
    function (string1, string2, string3) {
      let str = "";
      if (string1 == string2 || string1 == string3) str = "selected";
      return new hbs.SafeString(str);
    }
  );

  hbs.registerHelper("shortDate", function (date) {
    if (!date) return '';
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString();
  });

  hbs.registerHelper("jsDate", function (date) {
    var formatter = new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    let [{ value: month }, , { value: day }, , { value: year }] =
      formatter.formatToParts(date);
    return year + "-" + month + "-" + day;
  });

  hbs.registerHelper("calculateRows", function (string) {
    if (!string || string.length == 0) return 4;
    return Math.ceil(string.length / 45);
  });

  hbs.registerHelper("calculateRowsShort", function (string) {
    if (!string || string.length == 0) return 2;
    return Math.ceil(string.length / 37);
  });

  hbs.registerHelper("correctOrIncorrrect", function (correct) {
    let str = "";
    if (correct) {
      str = '<strong style="color: green">Correct!</strong>';
    } else {
      str = '<strong style="color: red">Incorrect</strong>';
    }

    return new hbs.SafeString(str);
  });

  hbs.registerHelper("selectedForRole", function (roles, role) {
    if (roles && roles.includes(role)) {
      return "selected";
    } else return "";
  });

  hbs.registerHelper("divide", function (one, two) {
    return (one / two) * 100;
  });

  hbs.registerHelper("reportedHelper", function (reported) {
    return reported ? "reported" : "";
  });

  hbs.registerHelper("secondsToMMSS", function (seconds) {
    return (
      Math.floor(seconds / 60) +
      ":" +
      (seconds % 60).toLocaleString("en-US", { minimumIntegerDigits: 2 })
    );
  });

  hbs.registerHelper("homeContentHelper", function (homeContent) {
    return new hbs.SafeString(homeContent);
  });

  // Truncate text to a specified length
  hbs.registerHelper("truncate", function (text, length) {
    if (!text) return '';
    if (typeof length !== 'number') length = 100;
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  });

  // Add numbers (for index + 1)
  hbs.registerHelper("add", function (a, b) {
    return a + b;
  });

  // Equality comparison for conditionals
  hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
  
  // Simple equality helper for use in subexpressions like {{#if (eq a b)}}
  hbs.registerHelper("eq", function (arg1, arg2) {
    return arg1 == arg2;
  });
  
  // JSON stringify for debugging
  hbs.registerHelper("json", function (context) {
    return JSON.stringify(context, null, 2);
  });

  // Substring helper - extracts portion of string
  hbs.registerHelper("substring", function (str, start, end) {
    if (!str || typeof str !== 'string') return '';
    return str.substring(start, end);
  });

  // if_eq helper - equality comparison (alternative to ifEquals)
  hbs.registerHelper("if_eq", function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  // Not equals helper
  hbs.registerHelper("ifNotEquals", function (arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
  });

  // Default value helper - returns value or default if empty/undefined
  hbs.registerHelper("default", function (value, defaultValue) {
    return value || defaultValue;
  });

  // Or helper - returns first truthy value
  hbs.registerHelper("or", function (a, b) {
    return a || b;
  });

  // Or helper - returns first truthy value
  hbs.registerHelper("and", function (a, b) {
    return a && b;
  });

  // Module type label helper
  hbs.registerHelper("moduleTypeLabel", function (moduleType) {
    const labels = {
      'quiz': 'Quiz',
      'presentation': 'Presentation',
      'lesson': 'Lesson',
      'course': 'Course',
      'product_info': 'Product',
      'book_chapter': 'Chapter',
      'embedded': 'Interactive',
      'video': 'Video',
      'document': 'Document'
    };
    return labels[moduleType] || 'Content';
  });

  // Module type badge color helper
  hbs.registerHelper("moduleTypeBadge", function (moduleType) {
    const colors = {
      'quiz': 'primary',
      'presentation': 'info',
      'lesson': 'success',
      'course': 'success',
      'product_info': 'warning',
      'book_chapter': 'secondary',
      'embedded': 'dark',
      'video': 'danger',
      'document': 'light'
    };
    return colors[moduleType] || 'secondary';
  });

  // add "range" -- usage "{{#each (range 0 4)}}" or "{{#each (range 4)}}"
  hbs.registerHelper("range", function (start, end) {
    if (end === undefined) {
      end = start;
      start = 0;
    }
    let result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  });

  // Sum helper - can sum two numbers OR sum a property across an array of objects
  hbs.registerHelper("sum", function (a, b) {
    // If a is an array and b is a property name, sum that property
    if (Array.isArray(a) && typeof b === 'string') {
      return a.reduce((total, item) => {
        const value = item[b];
        return total + (typeof value === 'number' ? value : (value ? 10 : 0));
      }, 0);
    }
    // Otherwise, simple addition
    return (a || 0) + (b || 0);
  });

  // Increment helper - adds 1 to a number
  hbs.registerHelper("inc", function (value) {
    return (value || 0) + 1;
  });

  // Pluralize helper - adds 's' to word if count is not 1
  hbs.registerHelper("pluralize", function (count, singular, plural) {
    if (count == 1) {
      return singular;
    }
    return plural || (singular + 's');
  });

  // Date formatting helper
  hbs.registerHelper('formatDate', function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });
  
  // Equality helper
  hbs.registerHelper('eq', function(a, b) {
    return a === b;
  });

  // Join array helper - joins array elements with separator
  hbs.registerHelper('join', function(arr, separator) {
    if (!arr || !Array.isArray(arr)) return '';
    return arr.join(typeof separator === 'string' ? separator : ', ');
  });

  // Capitalize helper - capitalizes first letter
  hbs.registerHelper('capitalize', function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

};
