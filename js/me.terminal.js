$(function() {

  var andrewycho = (
    '[[gb;blue;black]' +
    '                         _                    __     __   _____ _            \n'+ 
    '         /\\             | |                   \\ \\   / /  / ____| |           \n'+
    '        /  \\   _ __   __| |_ __ _____      __  \\ \\_/ /  | |    | |__   ___   \n'+
    '       / /\\ \\ | \'_ \\ / _` | \'__/ _ \\ \\ /\\ / /   \\   /   | |    | \'_ \\ / _ \\  \n'+
    '      / ____ \\| | | | (_| | | |  __/\\ V  V /     | |    | |____| | | | (_) | \n'+
    '     /_/    \\_\\_| |_|\\__,_|_|  \\___| \\_/\\_/      |_|     \\_____|_| |_|\\___/  \n]' +
    '\n' + '\n'
  );  

  //== Typed Out Message Functions ==
  var anim = false;
  function typed(finish_typing) {
    return function(term, message, delay, finish) {
      anim = true;
      var prompt = term.get_prompt();
      var c = 0;

      if (message.length > 0) {
        term.set_prompt('');
        var interval = setInterval(function() {
          term.insert(message[c++]);
          if (c == message.length) {
          clearInterval(interval);
          // execute in next interval
          setTimeout(function() {
            // swap command with prompt
            finish_typing(term, message, prompt);
            anim = false
            finish && finish();
            }, delay);
          }
        }, delay);
      }
    };
  }

  var typed_prompt = typed(function(term, message, prompt) {
    // swap command with prompt
    term.set_command('');
    term.set_prompt(message + ' ');
  });

  var typed_message = typed(function(term, message, prompt) {
    term.set_command('');
    term.echo(message)
    term.set_prompt(prompt);
  });


  //== Process Commands ==
  var commands = ["about", 
                  "education", 
                  "experience", 
                  "projects", 
                  "publications", 
                  "hobbies" ];

  $('#terminal').terminal(function(cmd, term) {
    term.set_prompt('> ');
    cmd = cmd.toLowerCase();

    if (cmd == "home") {
      clearTerminal(term);
    }
    else if (cmd == "help") {
      printHelp(term); 
    }
    else if (commands.indexOf(cmd) != -1) {
      var link = 'info/' + cmd + '.txt';
      printData(term, link);
    }
    else {
      var msg = "UNKNOWN COMMAND."
      typed_message(term, msg, 10);
    }

  //== MAIN TERMINAL ==
  }, {
    name: 'terminal',
    greetings: null,
    onInit: function(term) {
      setTerminalHeight(term);
      greetings(term);
    },
    keydown: function(e) {
      //disable keyboard when animating
      if (anim) {
        return false;
      }
    }
  });


  //== Menu - Home ==
  $("#side_menu a").click(function(){

    // Scroll to the Top

    $("html, body").animate({ scrollTop: 0 }, 1000);

    term = $('#terminal').terminal();
    term.echo('> '+ $(this).attr('datacommand'));

    //== Parse Comands ==
    // Home
    if ($(this).attr('datacommand') == 'home') {
        clearTerminal(term);
    }   
    // About
    else if ($(this).attr('datacommand') == 'about') {
      var link = 'info/about.txt';
      printData(term, link);
    }   
    // Education
    else if ($(this).attr('datacommand') == 'education') {
      var link = 'info/education.txt';
      printData(term, link);
  }   
    // Experience
    else if ($(this).attr('datacommand') == 'experience') {
      var link = 'info/experience.txt';
      printData(term, link);
    }   
    // Projects
    else if ($(this).attr('datacommand') == 'projects') {
      var link = 'info/projects.txt';
      printData(term, link);
    }   
    // Publications
    else if ($(this).attr('datacommand') == 'publications') {
      var link = 'info/publications.txt';
      printData(term, link);
    }   
    // Resume
    else if ($(this).attr('datacommand') == 'resume') {
      var link = 'info/resume.txt';
      printData(term, link);
    }   
    // Hobbies
    else if ($(this).attr('datacommand') == 'hobbies') {
      var link = 'info/hobbies.txt';
      printData(term, link);
    }   
    // Contact 
    else if ($(this).attr('datacommand') == 'contact') {
      var link = 'info/contact.txt';
      printData(term, link);
    }   
    else {
        term.insert($(this).attr('datacommand')+' ');
        //$('#t').terminal().exec("help 1");
        term.terminal().focus();
    }               
    return false;
  });

  //== Link Menu Scrolling ==
  $("#links_menu a").click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    return false;
  });

  //== Print Data ==
  function printData(term, link){
    $.get(link, function(data){
      typed_message(term,data,3);
    }, 'text');
    scrollToBottom(term);
  }

  //== Print Help ==
  function printHelp(term){
    var msg = "Type any of these commands:\n[[gb;yellow;black]";
    commands.forEach(function(entry) {
          msg = msg + entry + ' ';
    });
          msg = msg + ']';
    typed_message(term,msg,10);
  }

  //== Clear terminal ==
  function clearTerminal(term){
    term.clear();
    term.focus();
    greetings(term);
  }

  //== Greeting Message ==
  function greetings(term) {
    var link = 'info/greeting.txt';
    $.get(link, function(data){
      typed_message(term,data,10);
    }, 'text');
    scrollToBottom(term);
  }

  //== Scroll To Bottom ==
  function scrollToBottom(term) {
    var scrollHeight =  $('#terminal').height();
    $('#terminal').animate({scrollTop: scrollHeight},"fast" ); // was scroll_object
  }

  //== Adjust Terminal Box ==
  function setTerminalHeight(term) {
    var mxh = $("#home").height() - $("#callsign").height() - 70;
    //term.echo(mxh);
    term.height(mxh);
  }
  //== Resize - Adjust Terminal Box ==
  $(window).on('resize', function(){
    setTerminalHeight($('#terminal').terminal());
  });

});


