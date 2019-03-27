<?php
// ini_set('display_errors', 1);
// if(isset($_GET['admin']) && $_GET['admin'] == 'update'){
//     echo("YOU ARE ADMIN");
// }else{
//     error_reporting(E_ALL & ~E_NOTICE);
// }

// Засекаем время


$protocol = "//"; 
$time_start = microtime(true);
$basehref = $protocol.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
$current_url = $_GET['page_url'];






// $json = file_get_contents('data.json');
// $pages = json_decode($json);

// $url = 'https://spreadsheets.google.com/feeds/list/1o7rNLZL8312u0TV8nEIsqFz6uoYm8hDKHN19M8b6fd4/od6/public/values?alt=json';
// $url = 'values.json';
// $file= file_get_contents($url);
// $json = json_decode($file);

// $pages = array();
// $rows = $json->{'feed'}->{'entry'};


if(isset($_GET["admin"])){
    $url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1o7rNLZL8312u0TV8nEIsqFz6uoYm8hDKHN19M8b6fd4&single=true&gid=0&output=csv';
    $file = file_get_contents($url);
    file_put_contents('translations/landings_data.csv', $file);
}

// Set your CSV feed
$feed = 'translations/landings_data.csv';
// Arrays we'll use later
$keys = array();
$pages = array();
 
// Function to convert CSV into associative array
function csvToArray($file, $delimiter) { 
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
      for ($j = 0; $j < count($lineArray); $j++) { 
        $arr[$i][$j] = $lineArray[$j]; 
      } 
      $i++; 
    } 
    fclose($handle); 
  } 
  return $arr; 
}
 
// Do it
$data = csvToArray($feed, ',');
 
// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;
 
//Use first row for names  
$labels = array_shift($data);  
 
foreach ($labels as $label) {
  $keys[] = $label;
}
 
// Add Ids, just in case we want them later
$keys[] = 'id';
 
for ($i = 0; $i < $count; $i++) {
  $data[$i][] = $i;
}
 
// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $d = array_combine($keys, $data[$j]);
  $pages[$j] = $d;
}

$pages = json_decode(json_encode($pages), FALSE);

// print_r($pages);
 
// Print it out as JSON

if(!empty($_GET['lang'])){
    $lang = $_GET['lang'];
        }else{
            $lang = 'en';
        }

$currentpages = array();
foreach($pages as $pagedata){
    // print_r($pagedata->url.$pagedata->lang);
    if($pagedata->url == $current_url){
     $currentpages[] = $pagedata;
    }
}

if(empty($current_url) && empty($_GET['lang'])){
    // $currentpage = $pages{0};
    header("Location:/".$basehref."/".$pages{0}->url); /* Redirect browser */
    exit();
}


if(!empty($currentpages)){
    foreach($currentpages as $cp){
        if($cp->lang == $lang){
            $currentpage = $cp;
            $page_lang = $cp->lang;
            break;
        }
	}
    
    if(empty($currentpage)){
        http_response_code(404);
        header("Location:/".$basehref."/".$pages{0}->url); /* Redirect browser */
        exit();
    }

    // foreach ($pages as $pg) {
        // if($pg->lang != 'en'){
            // print_r($pg);
            // $page[$key]->url =  $pg->url."/".$pg->lang;
        // }
    // }

    // if(empty($current_url)){
    //     $currentpage = $pages{0};
    // }


	// langs full names for template
	$langs = array(
	    'en' => 'English', 
	    'it' => 'Italiano', 
	    'es' => 'Español', 
	    'de' => 'Deutsch', 
	    'ru' => 'Русский',
	    'ar' => 'العربية',
	    'jp' => '日本語',
	    'pl' => 'Poland'
	);

	// Coins theme changes
	$dark = array("bitcoin-cash", "dash", "ethereum", "ripple");
	(in_array($currentpage->coin, $dark)) ? $currentpage->theme = "dark" : $currentpage->theme = "light";

	$coins = array(
	    'bitcoin' => 'BTC', 
	    'bitcoin-cash' => 'BCH', 
	    'ethereum' => 'ETH', 
	    'dash' => 'DASH', 
	    'litecoin' => 'LTC', 
	    'ripple' => 'XRP'
	);

	// Arabic coins names
	$coins_ar = array(
	    'bitcoin' => 'بيتكوين', 
	    'bitcoin-cash' => 'بيتكوين كاش', 
	    'ethereum' => 'إيثيريوم', 
	    'dash' => 'داش', 
	    'litecoin' => 'لايتكوين', 
	    'ripple' => 'ريبل'
	);
	$coins_jp = array(
	    'bitcoin' => 'ビットコイン', 
	    'bitcoin-cash' => 'ビットコインキャッシュ', 
	    'ethereum' => 'イーサリアム', 
	    'dash' => 'ダッシュ',
	    'litecoin' => 'ライトコイン', 
	    'ripple' => 'リップル'
	);
	    
	if($currentpage->lang == 'ar'){
	    $coin_ucfirst = ucfirst($coins_ar[$currentpage->coin]);
	}elseif($currentpage->lang == 'jp'){
	    $coin_ucfirst = ucfirst($coins_jp[$currentpage->coin]);
	}else{
	    $coin_ucfirst = ucfirst($currentpage->coin);
	}



	//Get page translations from Google sheerts landings_translations

	//if admin update saved data file 
	if(isset($_GET['admin'])){
	  $url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1o7rNLZL8312u0TV8nEIsqFz6uoYm8hDKHN19M8b6fd4&single=true&gid=927036622&output=csv';
	  $file = file_get_contents($url);
	  file_put_contents('translations/landings_translations.csv', $file);
	}

	# Open the File.
	if (($handle = fopen("translations/landings_translations.csv", "r")) !== FALSE) {
	    # Set the parent multidimensional array key to 0.
	    $nn = 0;
	    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
	        # Count the total keys in the row.
	        $c = count($data);
	        # Populate the multidimensional array.
	        for ($x=0;$x<$c;$x++)
	        {
	            $csvarray[$nn][$x] = $data[$x];
	        }
	        $nn++;
	    }
	    # Close the File.
	    fclose($handle);
	}

	// take the row'ified data and columnize the array
	function columnizeArray($csvarray) {
	    $array = array();
	    foreach($csvarray as $key=>$value) {
	        // reparse into useful array data.
	        if ($key == 0) {
	            foreach ($value AS $key2=>$value2) {
	                $array[$key2] = array();
	                $array[$key2][] = $value2;
	            }
	        }else if ($key > 0){
	            foreach ($value as $key3=>$value3) {
	                $array[$key3][] = $value3;
	            }
	        }else{
	        }
	    }
	    return $array;
	}
	function groupColumns($array = null) {
	    $array2 = array();
	    foreach ($array as $k=>$v) {
	        // procss each column        // $k = column number        // $v = array of rows
	        if ($k == 0) {}else{ // working on column 2 or higher
	            $array2[$v[0]] = array();
	            foreach ($array[0] as $k1=>$v1) {
	                if ($k1 > 0) { // ignore the column heading
	                    // store the first column variable in as the key.
	                    // Store the value associated with this item as the value.
	                    $array2[$v[0]][$v1] = $v[$k1];
	                }
	            }
	     }
	    }
	    $pages = json_decode(json_encode($array2), FALSE);
	    return $pages;
	}


	$currentpagetranslation = groupColumns(columnizeArray($csvarray));


	$translation = new stdClass();
	foreach($currentpagetranslation->{$currentpage->lang} as $key=>$page_translation){
	    $translation->$key = str_replace("%coin%", $coin_ucfirst, $page_translation);
	}



$currentpage->lang = $page_lang;
$currentpage->coin_code = $coins[$currentpage->coin];

$currentpage->translation = $translation;
$currentpage->translation->h1 = $translation->{$currentpage->cat};

}else{
    http_response_code(404);
    echo "<h1>Page not found 404</h1>";
    die();
}
?>






<!DOCTYPE html>
<html lang="<?php echo $currentpage->lang; ?>">
<head>
    <base href="/<?php echo $basehref; ?>/">
    <meta charset="utf-8">
    <title><?php echo $currentpage->meta_title; ?> | DEMO </title>
    <meta name="description" content="<?php echo $currentpage->translation->meta_description; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="no-referrer-when-downgrade">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="canonical" href="<?php echo $currentpage->url; ?>/<?php echo $currentpage->lang; ?>" />
    <meta property="og:title" content="<?php echo $currentpage->meta_title; ?> | DEMO" />
    <meta property="og:description" content="<?php echo $currentpage->translation->meta_description; ?>" />
    <meta property="og:image" content="https://lp.olympusmarkets.com/crypto/images/offer-<?php echo $currentpage->coin; ?>-min.jpg" />




    <link rel="stylesheet" href="css/fonts.css">
    <link rel="stylesheet" href="css/min.css">

    <script type='text/javascript' src='js/jquery-3.2.1.min.js'></script>
    <script type='text/javascript' src='js/plugins.js'></script>
    <script type='text/javascript' src='js/sweetalert.min.js'></script>

    <script> let currentLang = '<?php echo $currentpage->lang; ?>'; </script>
	<script src="//jsback.olympusmarkets.com/js/tsapi.js" type="text/javascript"></script>
	<!-- <script src="js/tsapi.js?ver=1.0.0-<?=time()?>" type="text/javascript"></script> -->

    <?php if ($currentpage->lang == 'ar') { ?><link rel='stylesheet' id='rtl-css-css' href='css/rtl.css' type='text/css' media='all' /><?php }; ?>
    <style>.post-thumbnail img[src$='.svg'] { width: 100%; height: auto; }</style>
    
    <?php foreach ($currentpages as $tr) {
        if ($tr->lang != $currentpage->lang) {
        ?>
    <link rel="alternate" href="<?php echo $tr->url .'/'. $tr->lang; ?>" hreflang="<?php echo $tr->lang ?>" />
    <?php }}; ?>

    <link rel="icon" href="images/favicon.png" sizes="16x16" />



<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'}); var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:''; j.async = true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-K82SZ77'); </script>
</head>

<body class="<?php echo $currentpage->lang; ?>">

 <header class="<?php echo $currentpage->coin; ?>">

<div class="menu__top">

  <a href="http://strattonmarkets.com/" target="_blanck">
    <img src="images/logo.png" alt="logo" class="logo">
  </a>

  
  <div class="leng">
                <div class="nh-language-switcher">
                    <div class="js-lang-select">
                        <span class="js-lang-select-holder lang-item">
                            <span class="flag">
                                <img src="images/theme/flags/<?php echo $currentpage->lang; ?>-l.svg" alt="<?php echo $currentpage->lang; ?>-flag">
                            </span>
                            <span class="name"> <?php echo $langs[$currentpage->lang]; ?> </span>
                        </span>
                        <ul class="js-lang-select-dropdown">
                            <?php foreach ($currentpages as $tr){ 
                                if($tr->lang != 'jp'){ ?>
                                    <li class="lang-item lang-item-<?php echo $tr->lang; ?>">
                                        <a href="<?php echo $tr->url; ?>/<?php if($tr->lang != 'en'){ echo $tr->lang; }; ?>">
                                            <span class="flag">
                                                <img src="images/theme/flags/<?php echo $tr->lang; ?>-l.svg" alt="<?php echo $tr->lang; ?>-flag">
                                            </span>
                                            <span class="name"><?php echo $langs[$tr->lang]; ?></span>
                                        </a>
                                    </li>
                                <?php }; ?> 
                            <?php }; ?> 
                        </ul>
                    </div>
                </div>
            </div>
 
  </div>


</div>

<div class="container">

  <div class="box__video">
    <a class="popup-youtube" href="https://www.youtube.com/watch?v=5HJmfn-2Amc"><img src="images/speaker.png" alt="speaker"></a>
    
    <p><?php echo $currentpage->log__info;?></p>
  </div>

  <div class="row inset">
    <div class="col m6 s6 l6 xl2 left__box">
      <img src="images/trend_line.png" alt="trend_line" class="trend__line">

      <div class="box__sale">

        <p class="h3">170.41</p>
        <p class="red">-0,53 (-0,15%)</p>

        <p class="box__wid"><?php echo $currentpage->p_information;?></p>
        
      </div>

    </div>
    <div class="col m6 s6 l6 xl4 apple">

      <img src="<?php echo $currentpage->img__url;?>" alt="<?php echo $currentpage->coin; ?>" class="apple-logo">

    </div>
    <div class="col m12 s12 l12 xl6 right__box">

      <h2 class="h1__"><?php echo $currentpage->h2__title;?></h2>

      <div class="box__inform">
        <span class="bid grin">170.41</span>
        <span class="ask red">170.41</span>
        <span class="spread">0.5</span>

        <a href="" class="sell">Sell</a>

        <a href="" class="buy">Buy</a>

      </div>

      <a href="" class="button__yellow"><?php echo $currentpage->button__link;?></a>

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

        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <script type="text/javascript">
          new TradingView.widget({
            "autosize": true,
            "symbol": "NASDAQ:AAPL",
            "interval": "W",
            "timezone": "Etc/UTC",
            "theme": "Light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "rgba(255, 255, 255, 1)",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "allow_symbol_change": true,
            "save_image": false,
            "container_id": "tradingview_a3024"
          });
        </script>
      </div>

    </div>
  </div>
</div>

</header>

<footer>

<div class="container">
  <div class="row">
    <div class="col m12 s12 l12 xl12">


    <p>COMPANY INFORMATION: F1Markets Limited is authorised and regulated by the Cyprus Securities and Exchange Commission with CIF Licence number 267/15. F1Markets Limited is operating the website www.strattonmarkets.com for the provision of services within the European Economic Area and Switzerland.</p>

    <p>RISK WARNING: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 74-89% of retail investor accounts lose money when trading CFDs. you should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. please read our risk disclosure document.</p>

    <p>Stratton Markets does not issue advice, recommendations or opinions in relation to acquiring, holding or disposing of any financial product. F1Markets Limited is not a financial adviser and all services are provided on an execution only basis. Demo accounts may not behave in the exact same manner as real accounts. Leverage and regional restrictions apply – contact us for more information. During times of markets volatility trading risks may increase. Virtual currencies values can widely fluctuate and may result in significant losses.</p>

    <p>DISCLAIMER: This material is considered as marketing communication. Any opinions, news, research, analysis, prices or other information provided by F1Markets Ltd do not constitute investment recommendations and/or advice. F1Markets Ltd does not take into account your personal investment objectives or financial situation. Past performance does not constitute a reliable indicator of future results. Future forecasts do not constitute a reliable indicator of future performance. F1Markets Ltd makes no representation and assumes no liability as to the accuracy or completeness or validity or timeliness of the information provided, nor any loss arising from any investment based on a communication, forecast or other information supplied by an employee of F1Markets Ltd, a third party or otherwise. Furthermore, this material has not been prepared in accordance with legal requirements promoting the independence of investment research and it is not subject to any prohibition on dealing ahead of the dissemination of investment research. All expressions of opinion are subject to change without notice. Any opinions made may be personal to the author and may not reflect the opinions of Stratton Markets. Trading alerts, signals or market updates provided by Stratton Markets should not be considered as investment advice or investment recommendation. The decision to act on any signal or alert is yours and is taken at your own risk. Research before you trade.</p>
    
    </div>
  </div>
</div>

</footer>








<!-- 
	<script src="https://jsback.olympusmarkets.com/js/socket.io.js?ver=1.0.0-<?=time()?>"></script>
	<script src="js/crmlib.js?ver=1.0.0-<?=time()?>"></script>
	<script src="js/ts-front.js?ver=1.0.0-<?=time()?>" type="text/javascript"></script> -->

    
    <script type='text/javascript' src='js/main.js?1'></script>

    <script type="text/javascript" src="js/JSmain.js"></script>

    <script>
    $( document ).ready(function() {
        var trade_url = window.TSAPI.siteSetting.platformLink;
        // console.log(window.TSAPI);
        var puser  = window.TSAPI.user.isGuest;
        if( puser == false){
            $(".signup-form .text-center").html('<h2><?php echo $currentpage->translation->already_registered; ?></h2><h3><?php echo $currentpage->translation->hurray; ?></h3><a href="//trade.olympusmarkets.com/trade?lang=<?php echo $currentpage->lang; ?>" class="btn btn-primary"><?php echo $currentpage->translation->trade_button; ?></a>');
            } else {
        }
    });
	</script>
    
</body>

</html>

<?php

if(1)
{
	print "<!--\r\n";
	$time_end = microtime(true);
	$exec_time = $time_end-$time_start;
  
  	if(function_exists('memory_get_peak_usage'))
    print "memory peak usage: ".memory_get_peak_usage()." bytes\r\n";  
	print "page generation time: ".$exec_time." seconds\r\n";  
	print "-->";
}