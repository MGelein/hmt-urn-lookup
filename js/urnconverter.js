/**Copies text to clipboard from the provided element*/
function copyTextToClipboard(element){
  var copyText = $(element).text().split('<>')[0];
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = copyText.trim();
  document.body.appendChild(textArea);
  textArea.select();
  try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      if(msg != 'successful'){
        copyText = "ERROR: UNABLE TO COPY";
      }else{
        copyText = 'Copied: ' + copyText;
      }
      showNotif(copyText);
  } catch (err) {
      showNotif("ERROR: UNABLE TO COPY");
  }
  document.body.removeChild(textArea);
}

/**
Shows the notification
**/
function showNotif(text){
  $('#notification').removeClass().addClass('showNotification');
  $('#notificationText').html(text);
  setTimeout(function(){
    $('#notification').removeClass().addClass('hideNotification');
  }, 2000);
}

/**Handles the conversion from a line to image**/
var indexTable;
function convertURNIndex(){
  var urnToConv = $('#urnConvBoxIndex').val().toLowerCase();
  var max = indexTable.length;
  var cCombo;
  var matches = [];
  var duplicates = [];
  var index;
  var book;
  var line;
  var bookToConv = (urnToConv.length > 0) ? urnToConv : "*";
  var lineToConv = "*";
  if(urnToConv.indexOf(".") != -1){
    bookToConv = urnToConv.split('.')[0];
    if(urnToConv.split('.')[1].length > 0){
      lineToConv = urnToConv.split('.')[1];
    }
  }
  var folioName;
  for(var i = 0; i < max; i++){
    cCombo = indexTable[i];
    index = cCombo.index.substr(cCombo.index.lastIndexOf(":") + 1);
    book = index.split('.')[0];
    line = index.split('.')[1];
    if((book == bookToConv || bookToConv == "*") && (line == lineToConv || lineToConv == "*")){
      index = cCombo.index.substr(cCombo.index.lastIndexOf(":") + 1);
      if(matches.length > 400) break;
      folioName = cCombo.folio.substring(0, cCombo.folio.indexOf('.v1'));
      matches.push(
        "<a href='#' onclick='fillInImageField(\"" + folioName.substr(folioName.lastIndexOf('.') + 1) + "\")'> " +
        index + "&nbsp;<>&nbsp;" + folioName + "</a>"
      );
    }
  }
  var noResultText = "<div class='text-center'><h4>Oops, no results seem to match your query!</h4><br><p>Please check your spelling or go to the " +
  "Github issue tracker to request this document to be changed to include your query.</p></div>";
  if(matches.length == 0) matches.push(noResultText);
  $('#urnConvertedIndex').html(matches.join("<br>"));
}

/**
Fill the image search fill with the provided query
**/
function fillInImageField(string){
  $('#urnConvBox').val(string);
  convertURNImage();
}

/**Handles the urn conversion from a folio to an image*/
var urnTable = [];
function convertURNImage(){
  var urnToConv = $('#urnConvBox').val().toLowerCase();
  var max = urnTable.length;
  var cCombo;
  var matches = [];
  //Go through all urns
  for(var i = 0; i < max; i++){
    cCombo = urnTable[i];
    if(cCombo.urn.indexOf(urnToConv) != -1){
      //Find out what folio this VA is exactly
      var folio = cCombo.defaultimg.substr(cCombo.defaultimg.lastIndexOf(':') + 1).replace(/VA(....)N_..../g, '$1').toLowerCase();
      var mgImage = "http://www.homermultitext.org/ict2/index.html?urn=" + cCombo.defaultimg;
      matches.push(
        "<div class='entry'>" +
        cCombo.urn.substr(cCombo.urn.lastIndexOf(':') + 1) + ':&nbsp;' +
        "<a class='mg pull-right' target='_blank' href='" + mgImage + "'>Marc. Graec.</a>&nbsp;" +
        "<a class='comp pull-right' target='_blank' href='#'>Comparetti</a>&nbsp;" +
        "</div>"
      );
    }
  }
  var noResultText = "<div class='text-center'><h4>Oops, no results seem to match your query!</h4><br><p>Please check your spelling or go to the " +
  "Github issue tracker to request this document to be changed to include your query.</p></div>";
  if(matches.length == 0) matches.push(noResultText);
  $('#urnConverted').html(matches.join(""));
}

/**Handles the urn conversion from a persName to a URN**/
var persTable;
function convertURNPers(){
  var urnToConv = $('#urnConvBoxPers').val().toLowerCase();;
  var max = persTable.length;
  var cCombo;
  var matches = [];
  for(var i = 0; i < max; i++){
    cCombo = persTable[i];
    if(cCombo.Label.toLowerCase().indexOf(urnToConv) != -1 && cCombo.Status != 'rejected' && cCombo.urn != "urn"){
        matches.push(
          "<span class='clickLink' onclick='copyTextToClipboard(this)'>" + cCombo.urn + " <> " + cCombo.Label + "</span>"
        );
    }
  }
  $('#urnConvertedPers').html(matches.join("<br>"));
}

/**Handles the urn conversion from a placeName to a URN**/
var placeTable;
function convertURNPlace(){
  var urnToConv = $('#urnConvBoxPlace').val().toLowerCase();;
  var max = placeTable.length;
  var cCombo;
  var matches = [];
  for(var i = 0; i < max; i++){
    cCombo = placeTable[i];
    if(cCombo.Label.toLowerCase().indexOf(urnToConv) != -1 && cCombo.Status != 'rejected' && cCombo.urn != "urn"){
      matches.push(
        "<span class='clickLink' onclick='copyTextToClipboard(this)'>" + cCombo.urn + " <> " + cCombo.Label + "</span>"
      );
    }
  }
  $('#urnConvertedPlace').html(matches.join("<br>"));
}

/**Handles the urn conversion from a placename to a URN */
var compTable;
function findCompImage(folio){
  if(!compTable) return "";
  var vaImage = "urn:cite:hmt:comp.va" + folio + ".v1"
  for(var i = 0; i < compTable.length; i++){
    var cComp = compTable[i];
    if(cComp.va == vaImage){
      return "http://www.homermultitext.org/hmt-digital/ict.html?urn=" + cComp.comp; 
    }
  }
}

/**
Called when the document is ready to be executed
**/
$(document).ready(function(){

  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-authlists/master/data/hmtnames.csv"})
    .done(function(data) {
      persTable = csvJSON(data, true, ['urn','Label', 'Description','Status','Redirect','StemClass'], true);
      convertURNPers();
      $('#persURNIcon').removeClass().addClass('hidden');
      $('#persURNLabel').html('');
  });

  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-authlists/master/data/hmtplaces.csv"})
    .done(function(data) {
      placeTable = csvJSON(data, true, ['urn','Label', 'Description','Pleiades','Status','Redirect'], true);
      convertURNPlace();
      $('#placeURNIcon').removeClass().addClass('hidden');
      $('#placeURNLabel').html('');
  });
/*
  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/indices/textToSurface/venetusA/venA-Iliad.csv"})
    .done(function(data) {
      indexTable = csvJSON(data, true, ['index','folio'], false);
      convertURNIndex();
      $('#indexURNIcon').removeClass().addClass('hidden');
      $('#indexURNLabel').html('');
  });*/

  /*
  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/indices/tbsToDefaultImage/comparetti.csv"})
    .done(function(data){
      compTable = csvJSON(data, true, ['va', 'comp'], true);
  });*/

  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/codices/vapages.cex"})
    .done(function(data){
      cexJSON(data, '#!citedata');
      convertURNImage();
      $('#imgURNIcon').removeClass().addClass('hidden');
      $('#imgURNLabel').html('');
  });

  

  //When you focus on the field you clear it
  $('#urnConvBox').focus(function(){
    $('#urnConvBox').val('');
    convertURNImage();
  });
  $('#urnConvBoxPers').focus(function(){
    $('#urnConvBoxPers').val('');
    convertURNPers();
  });
  $('#urnConvBoxPlace').focus(function(){
    $('#urnConvBoxPlace').val('');
    convertURNPlace();
  });
  $('#urnConvBoxIndex').focus(function(){
    $('#urnConvBoxIndex').val('');
    convertURNIndex();
  });
});

/**
Convert csv to JSON. This is used on the csv files loaded
from Github
*/
function csvJSON(csv, userDefinedHeader, headerDef){
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(',');
  var offset = 0;
  if(userDefinedHeader){
    headers = headerDef;
    offset = 1;
  }
  var numLines = lines.length;
  var numHeaders = headers.length;
  var obj = {}; var currentline;
  for(var i=1;i<numLines;i++){
	  obj = {};
	  currentline=lines[i - offset].split(",");
	  for(var j=0;j<numHeaders;j++){
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  }
  return result;
}

/**
 * Parses the provided file as a string startgin from the provided header.
 * Returns a JSON result
 * @param {String} file 
 * @param {String} header 
 */
function cexJSON(file, header){
  console.log("Converting file");
  var lines = file.split('\n');
  var foundIndex = -1;
  var endIndex = -1;
  for(var i = 0 ; i < lines.length; i++){
    //Try to find the starting header
    if(lines[i].indexOf(header) == 0){
      foundIndex = i;
      continue;
    }
    //Next section start
    if(lines[i].indexOf('#!') == 0 && foundIndex > -1){
      endIndex = i;
      break;
    }
  }

  //If we haven't found another topic, read untill end
  if(endIndex == -1) endIndex = lines.length;

  //Read the headerline and parse it into the object
  var headerNames = lines[foundIndex + 1].split('#');

  //Go through all the lines and parse them into the object
  for(var i = foundIndex + 2; i < endIndex; i ++){
    //Skip this line if empty
    if(lines[i].trim().length < 1) continue;
    //Create an empty entry
    var entry = {};
    //Split the line into parts
    var items = lines[i].split('#');
    //Go through every item and enter them
    for(var j = 0; j < items.length; j++){
      entry[headerNames[j]] = items[j];
    }
    //Now add the entry to the list
    urnTable.push(entry);
  }
}
