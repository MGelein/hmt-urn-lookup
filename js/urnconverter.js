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
var urnTable;
function convertURNImage(){
  var urnToConv = $('#urnConvBox').val().toLowerCase();
  var max = urnTable.length;
  var cCombo;
  var matches = [];
  for(var i = 0; i < max; i++){
    cCombo = urnTable[i];
    if(cCombo.name.indexOf(urnToConv) != -1){
      //Find out what folio this VA is exactly
      var folio = cCombo.imgName.substr(cCombo.imgName.lastIndexOf(':') + 1).replace(/VA(....)N_..../g, '$1').toLowerCase();
      var compImage = findCompImage(folio);
      var mgImage = "http://www.homermultitext.org/ict2/index.html?urn=" + cCombo.imgName;
      matches.push(
        "<div class='entry'>" +
        cCombo.name.substr(cCombo.name.lastIndexOf(':') + 1) + ':&nbsp;' +
        "<a class='mg pull-right' target='_blank' href='" + mgImage + "'>Marc. Graec.</a>&nbsp;" +
        "<a class='comp pull-right' target='_blank' href='" + compImage + "'>Comparetti</a>&nbsp;" +
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
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/indices/tbsToDefaultImage/venA.csv"})
    .done(function(data) {
      urnTable = csvJSON(data, true, ['name', 'imgName'], false);
      convertURNImage();
      $('#imgURNIcon').removeClass().addClass('hidden');
      $('#imgURNLabel').html('');
  });

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

  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/indices/textToSurface/venetusA/venA-Iliad.csv"})
    .done(function(data) {
      indexTable = csvJSON(data, true, ['index','folio'], false);
      convertURNIndex();
      $('#indexURNIcon').removeClass().addClass('hidden');
      $('#indexURNLabel').html('');
  });

  $.ajax({
    url: "https://raw.githubusercontent.com/homermultitext/hmt-archive/master/archive/indices/tbsToDefaultImage/comparetti.csv"})
    .done(function(data){
      compTable = csvJSON(data, true, ['va', 'comp'], true);
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
