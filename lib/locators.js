var util = require('util');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts.js');

/**
 * The Protractor Locators. These provide ways of finding elements in
 * Angular applications by binding, model, etc.
 *
 * @augments webdriver.Locator.Strategy
 */
var ProtractorBy = function() {};
var WebdriverBy = function() {};

/**
 * webdriver's By is an enum of locator functions, so we must set it to
 * a prototype before inheriting from it.
 */
WebdriverBy.prototype = webdriver.By;
util.inherits(ProtractorBy, WebdriverBy);

/**
 * Add a locator to this instance of ProtractorBy. This locator can then be
 * used with element(by.<name>(<args>)).
 *
 * @param {string} name
 * @param {function|string} script A script to be run in the context of
 *     the browser. This script will be passed an array of arguments
 *     that contains any args passed into the locator followed by the
 *     element scoping the search. It should return an array of elements.
 */
ProtractorBy.prototype.addLocator = function(name, script) {
  this[name] = function(varArgs) {
    return {
      findElementsOverride: function(driver, using) {
        return driver.findElements(
          webdriver.By.js(script), varArgs, using);
      },
      message: 'by.' + name + '("' + varArgs + '")'
    }
  };
};

/**
 * Usage:
 *   <span>{{status}}</span>
 *   var status = element(by.binding('{{status}}'));
 */
ProtractorBy.prototype.binding = function(bindingDescriptor) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findBindings),
          bindingDescriptor, using);
    },
    message: 'by.binding("' + bindingDescriptor + '")'
  };
};

/**
 * Usage:
  * @DEPRECATED - use 'model' instead.
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.select("user"));
 */
ProtractorBy.prototype.select = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelects), model, using);
    },
    message: 'by.select("' + model + '")'
  };
};

/**
 * Usage:
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.selectedOption("user"));
 */
ProtractorBy.prototype.selectedOption = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelectedOptions), model, using);
    },
    message: 'by.selectedOption("' + model + '")'
  };
};

/**
 * @DEPRECATED - use 'model' instead.
 * Usage:
 *   <input ng-model="user" type="text"/>
 *   element(by.input('user'));
 */
ProtractorBy.prototype.input = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findInputs), model, using);
    },
    message: 'by.input("' + model + '")'
  };
};

/**
 * Usage:
 *   <input ng-model="user" type="text"/>
 *   element(by.model('user'));
 */
ProtractorBy.prototype.model = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findByModel), model, using);
    },
    message: 'by.model("' + model + '")'
  };
};

/**
 * Usage:
 *   <button>Save</button>
 *   element(by.buttonText("Save"));
 */
ProtractorBy.prototype.buttonText = function(searchText) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findByButtonText), searchText, using);
    },
    message: 'by.buttonText("' + searchText + '")'
  };
};

/**
 * Usage:
 *   <button>Save my file</button>
 *   element(by.partialButtonText("Save"));
 */
ProtractorBy.prototype.partialButtonText = function(searchText) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findByPartialButtonText), searchText, using);
    },
    message: 'by.partialButtonText("' + searchText + '")'
  };
};


/**
 * @DEPRECATED - use 'model' instead.
 * Usage:
 *   <textarea ng-model="user"></textarea>
 *   element(by.textarea("user"));
 */
ProtractorBy.prototype.textarea = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findTextareas), model, using);
    },
    message: 'by.textarea("' + model + '")'
  };
};

/**
 * Usage:
 *   <div ng-repeat = "cat in pets">
 *     <span>{{cat.name}}</span>
 *     <span>{{cat.age}}</span>
 *   </div>
 *
 * // Returns the DIV for the second cat.
 * var secondCat = element(by.repeater("cat in pets").row(1));
 * // Returns the SPAN for the first cat's name.
 * var firstCatName = element(
 *     by.repeater("cat in pets").row(0).column("{{cat.name}}"));
 * // Returns a promise that resolves to an array of WebElements from a column
 * var ages = element.all(
 *     by.repeater("cat in pets").column("{{cat.age}}"));
 * // Returns a promise that resolves to an array of WebElements containing
 * // all rows of the repeater.
 * var rows = element.all(by.repeater("cat in pets"));
 */
ProtractorBy.prototype.repeater = function(repeatDescriptor) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
        webdriver.By.js(clientSideScripts.findAllRepeaterRows),
        repeatDescriptor, using);
    },
    message: 'by.repeater("' + repeatDescriptor + '")',
    row: function(index) {
      return {
        findElementsOverride: function(driver, using) {
          return driver.findElements(
            webdriver.By.js(clientSideScripts.findRepeaterRows),
            repeatDescriptor, index, using);
        },
        message: 'by.repeater(' + repeatDescriptor + '").row("' + index + '")"',
        column: function(binding) {
          return {
            findElementsOverride: function(driver, using) {
              return driver.findElements(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  repeatDescriptor, index, binding, using);
            },
            message: 'by.repeater("' + repeatDescriptor + '").row("' + index +
                '").column("' + binding + '")'
          };
        }
      };
    },
    column: function(binding) {
      return {
        findElementsOverride: function(driver, using) {
          return driver.findElements(
              webdriver.By.js(clientSideScripts.findRepeaterColumn),
              repeatDescriptor, binding, using);
        },
        message: 'by.repeater("' + repeatDescriptor + '").column("' + binding +
            '")',
        row: function(index) {
          return {
            findElementsOverride: function(driver, using) {
              return driver.findElements(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  repeatDescriptor, index, binding, using);
            },
            message: 'by.repeater("' + repeatDescriptor + '").column("' +
                binding + '").row("' + index + '")'
          };
        }
      };
    }
  };
};

exports.ProtractorBy = ProtractorBy;
