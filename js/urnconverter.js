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
      matches.push(
        "<a href='http://www.homermultitext.org/ict2/index.html?urn=" + cCombo.imgName + "' target='_blank'>" + cCombo.imgName + "</a>"
      );
    }
  }
  var noResultText = "<div class='text-center'><h4>Oops, no results seem to match your query!</h4><br><p>Please check your spelling or go to the " +
  "Github issue tracker to request this document to be changed to include your query.</p></div>";
  if(matches.length == 0) matches.push(noResultText);
  $('#urnConverted').html(matches.join("<br>"));
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

/**
Called when the document is ready to be executed
**/
$(document).ready(function(){
  //convertURNPers();
  //convertURNPlace();
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
      $('#persURNLabel').html('');
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
