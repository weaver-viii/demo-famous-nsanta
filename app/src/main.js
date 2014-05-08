/*globals define*/
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var View     = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface       = require('famous/core/Surface');
    var SelectSurface       = require('SelectView');
    var ImageSurface  = require('famous/surfaces/ImageSurface');
    var InputSurface  = require('famous/surfaces/InputSurface');
    var Transform     = require('famous/core/Transform');
    var Easing        = require('famous/transitions/Easing');
    var Lightbox      = require('famous/views/Lightbox');
    var GridLayout    = require('famous/views/GridLayout');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var viewManager = {};
    // create the main context
    var mainContext = Engine.createContext();


    function createApp(){
        viewManager['main'] = createLightbox();
        viewManager['loginLightBox'] = createLightbox();
        viewManager['dashboardLightBox'] = createLightbox();
        createLogin();
        createDashboard();
        mainContext.add(viewManager['main']);
        displayView(viewManager['main'], 'loginView');
        displayView(viewManager['loginLightBox'], 'login1');
    };

    function createLogin(){
      createImageBackground();
      createLoginFirstStep();
      createLoginSecondStep();
      var modifier = new StateModifier({
        origin: [0,0]
      });
      viewManager['loginView']
        .add(modifier)
        .add(viewManager['loginLightBox']);
    };

    function createLoginFirstStep(){
      var mainView = new View();
      var views = [];
      viewManager['login1'] = mainView;
      var grid = createGrid([1,4], views);
      var gridModifier = new StateModifier({
        origin: [0.5, 1],
        size:[window.innerWidth - 50, window.innerHeight / 2]
      });
      views.push(new Surface({
        content: "<h1>Gest In Time</h1>",
        properties: {
          color: "white",
          textAlign: 'center',
          size:[undefined, 100]
        }
      }));
      var emailInput = new InputSurface({
        type: 'text',
        name: 'email',
        placeholder: 'Username',
      });
      var passwordInput = new InputSurface({
        type: 'password',
        name: 'password',
        placeholder: 'Password'
      });
      var submitButton = new InputSurface({
        type: 'submit',
        name: 'sigin',
        value: 'Sign In'
      });
      submitButton.on('click', function(){
        displayView(viewManager['loginLightBox'], 'login2');
        viewManager['loginViewModifier'].setTransform(Transform.translate(-170, 0,0),{ duration: 2000, curve: Easing.outBack });
      });
      views.push(createInputView(emailInput));
      views.push(createInputView(passwordInput));
      views.push(createInputView(submitButton));
      mainView.add(gridModifier).add(grid);
    };

    function createLoginSecondStep(){
        var mainView = new View();
      var views = [];
      viewManager['login2'] = mainView;
      var grid = createGrid([1,4], views);
      var gridModifier = new StateModifier({
        origin: [0.5, 1],
        size:[window.innerWidth - 50, window.innerHeight / 2]
      });
      views.push(new Surface({
        content: "<h1>Security Question</h1>",
        properties: {
          color: "white",
          textAlign: 'center',
          size:[undefined, 100]
        }
      }));
      var questionInput = new SelectSurface({
        name: 'question',
        placeholder: 'Select a Question',
        opts: {'1' : 'batman', '2': 'superman'},
        size: [undefined, 100]
      });
      var answerInput = new InputSurface({
        type: 'text',
        name: 'answer',
        placeholder: ''
      });
      var submitButton = new InputSurface({
        type: 'submit',
        name: 'send',
        value: 'Send'
      });
      questionInput.on('change', function(){
        console.log("Value");
        console.log(this.getValue());
      });
      submitButton.on('click', function(){
        displayView(viewManager['main'], 'dashboardView');
      });
      views.push(createInputView(questionInput));
      views.push(createInputView(answerInput));
      views.push(createInputView(submitButton));
      mainView.add(gridModifier).add(grid);

    };


    function createDashboard(){
      viewManager['dashboardView'] = new HeaderFooterLayout({
        headerSize: 40,
        footerSize: 10
      });
      viewManager['menuLink'] = new Surface({
        content: "|||",
        properties: {
          lineHeight: "40px",
          textAlign: "right",
          color: 'white'
        }
      });
      var menuLinkModifier = new StateModifier({
        origin: [0, 0]
      });
      viewManager['dashboardView'].header.add(menuLinkModifier).add(viewManager['menuLink']);

      viewManager['dashboardView'].header.add(new Surface({
        content: "Header",
        classes: ["grey-bg-top"],
        properties: {
          lineHeight: "40px",
          textAlign: "center",
          borderBottom: "2px solid white"
        }
      }));

      viewManager['dashboardView'].footer.add(new Surface({
        content: "",
        classes: ["grey-bg-bottom"],
        properties: {
          lineHeight: "10px",
          textAlign: "center",
          borderTop: "2px solid grey"
        }
      }));
    };

    function createGrid(dimensions, views){
      var grid = new GridLayout({
        dimensions: dimensions
      });
      grid.sequenceFrom(views);
      return grid;
    };

    function createInputView(input){
      var view = new View();
      var modifier = new StateModifier({
        origin: [0.5, 0.5],
        size: [undefined, 36]
      });
      view.add(modifier).add(input);
      return view;
    };

    function createImageBackground(){
      // your app here
        var logo = new ImageSurface({
          content: 'content/images/pregnancy-belly.jpg'
        });
      viewManager['loginViewModifier'] = new StateModifier({
         origin: [0, 0],
         size: [ window.innerWidth + 500, undefined]
      });
      viewManager['loginView'] = new View();
      viewManager['loginView'].add(viewManager['loginViewModifier']).add(logo);

    };

    function createLightbox() {
      var lightboxOptions = {
          inOpacity: 1,
          outOpacity: 1,
          inTransform: Transform.translate(window.innerWidth,0, 0),
          outTransform: Transform.translate(window.innerWidth *-1, 0, 0),
          inTransition: { duration: 1000, curve: Easing.easeOut },
          outTransition: { duration: 500, curve: Easing.easeOut }
      };
      var lightbox = new Lightbox(lightboxOptions);
      return lightbox;
    }


    function displayView(lightbox, view){
      lightbox.show(viewManager[view]);
    };

    createApp();


});

