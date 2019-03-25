<?php

$protocol = "//"; 

$full__url = $protocol.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);

$actual_urlink =  '//'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];



if ($actual_urlink == $full__url.'/' ) {
  $lang__list = 'en';
  $lang__dist = 'English';
} elseif ( $actual_urlink == $full__url.'/en' || $actual_urlink == $full__url.'/EN'){
  $lang__list = 'en';
  $lang__dist = 'English';
} elseif ( $actual_urlink == $full__url.'/it' || $actual_urlink == $full__url.'/IT') {
  $lang__list  = 'it';
  $lang__dist = 'Italiano';
} elseif ( $actual_urlink == $full__url.'/nl' || $actual_urlink == $full__url.'/NL') {
  $lang__list  = 'nl';
  $lang__dist = 'Dutch';
}else {
    http_response_code(404);
    echo("<h1>Page not found 404</h1>");
    die();
}


$urljson = 'data/'.$lang__list.'.json'; // path to your JSON file
$dataget = file_get_contents($urljson); // put the contents of the file into a variable
$variablesjson = json_decode($dataget); // decode the JSON feed


?>



<!DOCTYPE html>

<html lang="<?php echo $lang__list; ?>">

  <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>_DEMO</title>
    <meta name="description" content=""/>

    <link rel="stylesheet" href="css/fonts.css">
    <link rel="stylesheet" href="css/min.css">


  </head>

  <body>



  
   
    <header>

      <div class="menu__top">

        <a href="#" target="_blanck">
          <img src="images/logo.png" alt="logo" class="logo">
        </a>

        
        <div class="leng">
          <div class="nh-language-switcher">
              <div class="js-lang-select">
                    <span class="js-lang-select-holder lang-item">
                      <span class="flag"><img src="images/flags/<?php echo $lang__list; ?>-l.svg" alt="<?php echo $lang__list; ?>-flag"></span>
                      <span class="name"><?php echo $lang__dist; ?></span>
                    </span>

                      <ul class="js-lang-select-dropdown">
                        <li>
                          <a href="<?php echo $full__url; ?>/en">
                            <span class="flag"><img src="images/flags/en-l.svg" alt="<?php echo $lang__list; ?>-flag"></span>
                            <span class="name">English</span>
                          </a>
                        </li>
                        <li>
                          <a href="<?php echo $full__url; ?>/it">
                            <span class="flag"><img src="images/flags/it-l.svg" alt="<?php echo $lang__list; ?>-flag"></span>
                            <span class="name">Italiano</span>
                          </a>
                        </li>
                        <li>
                          <a href="<?php echo $full__url; ?>/nl">
                            <span class="flag"><img src="images/flags/nl-l.svg" alt="<?php echo $lang__list; ?>-flag"></span>
                            <span class="name">Dutch</span>
                          </a>
                        </li>
                      </ul>


                </div>
            </div>
        </div>


      </div>

      <div class="container">

        <div class="box__video">
          <a class="popup-youtube" href="https://www.youtube.com/watch?v=5HJmfn-2Amc"><img src="images/speaker.png" alt="speaker"></a>

          <p>Learn more about trading APPL shares</p>
        </div>

        <div class="row inset">
          <div class="col m6 s6 l6 xl2 left__box">
            <img src="images/trend_line.png" alt="trend_line" class="trend__line">

            <div class="box__sale">

              <p class="h3">170</p>
              <p class="red">-0,53)</p>

              <p class="box__wid">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, iatur. Excepteur sint occaecat cupidatat non pNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore</p>

            </div>

          </div>
          <div class="col m6 s6 l6 xl4 apple">

            <img src="images/apple-logo-shadow-desktop.png" alt="apple-logo-shadow-desktop" class="apple-logo">

          </div>
          <div class="col m12 s12 l12 xl6 right__box">

            <h2 class="h1__">Apple Inc.
              <br>AAPL</h2>

            <div class="box__inform">
              <span class="bid grin">170.41</span>
              <span class="ask red">170.41</span>
              <span class="spread">0.5</span>

              <a href="" class="sell">Sell</a>

              <a href="" class="buy">Buy</a>

            </div>

            <a href="" class="button__yellow">Trade APPL Shares</a>

            <ul class="box">
              <li>
                <p>Prev Close</p>
                <span>170.41</span>
              </li>
              <li>
                <p>Beta</p>
                <span>170.41</span>
              </li>
              <li>
                <p>Day’s Range</p>
                <span>170.41</span>
              </li>
              <li>
                <p>P/E Ration</p>
                <span>170.41</span>
              </li>
              <li>
                <p>52 Week Range</p>
                <span>170.41</span>
              </li>
              <li>
                <p>Revenue</p>
                <span>170.41</span>
              </li>
              <li>
                <p>Average Volume</p>
                <span>170.41</span>
              </li>
              <li>
                <p>EPS</p>
                <span>170.41</span>
              </li>
              <li>
                <p>1-Year Return</p>
                <span>170.41</span>
              </li>
              <li>
                <p>Dividend (Yield)</p>
                <span>170.41</span>
              </li>
            </ul>

            <div class="tradingview-widget-container">
              <div id="tradingview_a3024" style="height:300px;"></div>


            </div>

          </div>
        </div>
      </div>

    </header>

    <footer>

      <div class="container">
        <div class="row">
          <div class="col m12 s12 l12 xl12">

     
          </div>
        </div>
      </div>

    </footer>

 




    <script type="text/javascript" src="main.js"></script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/json2html/1.2.0/json2html.min.js"></script>
  </body>

</html>










