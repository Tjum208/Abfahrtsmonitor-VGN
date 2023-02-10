// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: black; icon-glyph: magic;
let widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();

async function createWidget() {

  ///////////////////////////////////////////////
  /////////////////////CONFIG////////////////////
  ///////////////////////////////////////////////

  let hstid = "2164"; //Beachte Halt_ID aus Tabelle
  let product = "bus"; // Ubahn | Bus | Tram

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////


  ///////////////////////////////////////////////
          //AB HIER NICHTS VERÄNDERN!//
  ///////////////////////////////////////////////
  let appIcon = await loadAppIcon();

  //UI für Linienfilter (Aktuell nur für Rathaus Fürth)
  let ui = new UITable();
  row = new UITableRow();
  row.isHeader = true;
  row.height = 80;
  ui.addRow(row);
  row.addText("Filtern nach Linien").centerAligned();
  line = "0"; // Falls Fehler line = 0

  if (hstid == "2164") {
    //Check für Rathaus Fürth
    ///33
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 33").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "33";
    };

    ///173
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 173").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "173";
    };

    ///174
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 174").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "174";
    };

    ///175
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 175").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "175";
    };

    ///177
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 177").centerAligned();
    ui.addRow(row);
    test = row.onSelect = () => {
      line = "177";
    };

    ///178
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 178").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "178";
    };

    ///179
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Linie 179").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "179";
    };
    ///Gen
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Nächste Abfahrten").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "0";
    };
  } else {
    ///Gen
    row = new UITableRow();
    row.dismissOnSelect = true;
    row.addText("Nächste Abfahrten").centerAligned();
    ui.addRow(row);
    row.onSelect = () => {
      line = "0";
    };
    /*
///Config
row = new UITableRow();
row.onSelect = async () => {
  console.log("Bananenmatsch")
  stopp = 1
  var idhst = await newid()
  row.removeAllRows()
  row.reload()
}}
row.dismissOnSelect = false;
row.addText("Haltestelle festlegen").centerAligned();
ui.addRow(row);

console.log(numhst)*/
  }
  let hst = await loadDocs([hstid, product]);

  await ui.present();

  console.log(line);

  var plycheck = await checkupline([hst, line]);
  if (plycheck === "error") {
    console.log("undefined");
  } else {
    console.log("Ergebnis:" + plycheck[0] + " 2. " + plycheck[1]);
  }
  var linecheck = await checkupline([hst, line]);

  let widget = new ListWidget();

  /////LINECHECK = 0 GENERAL -> Allgemeine Abfahrt
  if (linecheck == "error" || line == 0) {
    var plan0 = await timecalc(hst.Abfahrten[0].AbfahrtszeitSoll);
    let planist0 = await timecalc(hst.Abfahrten[0].AbfahrtszeitIst);
    var plan1 = await timecalc(hst.Abfahrten[1].AbfahrtszeitSoll);
    let planist1 = await timecalc(hst.Abfahrten[1].AbfahrtszeitIst);
    let delaytime0 = await delay([
      plan0[0],
      plan0[1],
      plan0[2],
      planist0[0],
      planist0[1],
      planist0[2],
    ]);
    let delaytime1 = await delay([
      plan1[0],
      plan1[1],
      plan1[2],
      planist1[0],
      planist1[1],
      planist1[2],
    ]);
    let hststart = hst.Haltestellenname;
    let linie0 = await linienname([0, hst]);
    let ziel0 = await dest([0, hst]);
    let linie1 = await linienname([1, hst]);
    let ziel1 = await dest([1, hst]);

    let title = "Nächste Abfahrten ab " + hststart;
    // Add background gradient
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color("141414"), new Color("13233F")];
    widget.backgroundGradient = gradient;
    // Show app icon and title
    let titleStack = widget.addStack();
    let appIconElement = titleStack.addImage(appIcon);
    appIconElement.imageSize = new Size(15, 15);
    appIconElement.cornerRadius = 4;
    titleStack.addSpacer(4);
    let titleElement = titleStack.addText(title);
    titleElement.textColor = Color.white();
    titleElement.textOpacity = 0.7;
    titleElement.font = Font.mediumSystemFont(13);
    widget.addSpacer(12);
    // Show API
    let nameElement = "test";
    nameElement.textColor = Color.white();
    nameElement.font = Font.boldSystemFont(18);
    widget.addSpacer(2);

    ///////////////////
    ////1. ZEILE///////
    ///////////////////

    //WENN Verspätung oder Verfrühung
    if (delaytime0[2] > 0 || delaytime0[2] < 0) {
      var mindelay = Math.floor((delaytime0[2] % 3600) / 60);
      var secdelay = Math.floor((delaytime0[2] % 3600) % 60);

      if (mindelay == 0) {
        //Wenn nur Sekunden Verspätung
        let descriptionElement0 = widget.addText(
          linie0 + " -> " + ziel0 + " " + plan0[3] + "  +" + secdelay + "sec"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.yellow();
      } else if (secdelay == 0) {
        //Wenn glatte Minute Verspätung
        let descriptionElement0 = widget.addText(
          linie0 + " -> " + ziel0 + " " + plan0[3] + "  +" + mindelay + "min"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.red();
      } else {
        //Verspätung von Minuten und Sekunden
        let descriptionElement0 = widget.addText(
          linie0 +
            " -> " +
            ziel0 +
            " " +
            plan0[3] +
            "  +" +
            mindelay +
            ":" +
            secdelay +
            "min"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.red();
      }
    } else {
      //Pünktlich (0:00)
      let descriptionElement0 = widget.addText(
        linie0 + " -> " + ziel0 + " " + plan0[3] + "  +0:00min"
      );
      descriptionElement0.textColor = Color.green();
      descriptionElement0.minimumScaleFactor = 0.5;
      descriptionElement0.font = Font.systemFont(18);
    }

    ///////////////////
    ////2. ZEILE///////
    ///////////////////

    if (delaytime1[2] > 0 || delaytime1[2] < 0) {
      var mindelay = Math.floor((delaytime1[2] % 3600) / 60);
      var secdelay = Math.floor((delaytime1[2] % 3600) % 60);

      if (mindelay == 0) {
        let descriptionElement1 = widget.addText(
          linie1 + " -> " + ziel1 + " " + plan1[3] + "  +" + secdelay + "sec"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.yellow();
      } else if (secdelay == 0) {
        let descriptionElement1 = widget.addText(
          linie1 + " -> " + ziel1 + " " + plan1[3] + "  +" + mindelay + "min"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.red();
      } else {
        let descriptionElement1 = widget.addText(
          linie1 +
            " -> " +
            ziel1 +
            " " +
            plan1[3] +
            "  +" +
            mindelay +
            ":" +
            secdelay +
            "min"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.red();
      }
    } else {
      let descriptionElement1 = widget.addText(
        linie1 + " -> " + ziel1 + " " + plan1[3] + "  +0:00min"
      );
      descriptionElement1.textColor = Color.green();
      descriptionElement1.minimumScaleFactor = 0.5;
      descriptionElement1.font = Font.systemFont(18);
    }
  }
  /////LINECHECK != 0 && !error-> Gefilterte Abfahrt
  else {
    var plan0 = await timecalc(hst.Abfahrten[linecheck[0]].AbfahrtszeitSoll);
    let planist0 = await timecalc(hst.Abfahrten[linecheck[0]].AbfahrtszeitIst);
    var plan1 = await timecalc(hst.Abfahrten[linecheck[1]].AbfahrtszeitSoll);
    let planist1 = await timecalc(hst.Abfahrten[linecheck[1]].AbfahrtszeitIst);
    let delaytime0 = await delay([
      plan0[0],
      plan0[1],
      plan0[2],
      planist0[0],
      planist0[1],
      planist0[2],
    ]);
    let delaytime1 = await delay([
      plan1[0],
      plan1[1],
      plan1[2],
      planist1[0],
      planist1[1],
      planist1[2],
    ]);
    let hststart = hst.Haltestellenname;
    let linie0 = await linienname([linecheck[0], hst]);
    let ziel0 = await dest([linecheck[0], hst]);
    let linie1 = await linienname([linecheck[1], hst]);
    let ziel1 = await dest([linecheck[1], hst]);

    let title = "Nächste Abfahrten ab " + hststart + ` [${line}]`;

    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color("141414"), new Color("13233F")];
    widget.backgroundGradient = gradient;
    let titleStack = widget.addStack();
    let appIconElement = titleStack.addImage(appIcon)
    appIconElement.imageSize = new Size(15, 15)
    appIconElement.cornerRadius = 4
    titleStack.addSpacer(4);
    let titleElement = titleStack.addText(title);
    titleElement.textColor = Color.white();
    titleElement.textOpacity = 0.7;
    titleElement.font = Font.mediumSystemFont(13);
    widget.addSpacer(12);
 

    ///////////////////
    ////1. ZEILE///////
    ///////////////////

    //WENN Verspätung oder Verfrühung
    if (delaytime0[2] > 0 || delaytime0[2] < 0) {
      var mindelay = Math.floor((delaytime0[2] % 3600) / 60);
      var secdelay = Math.floor((delaytime0[2] % 3600) % 60);

      if (mindelay == 0) {
        //Wenn nur Sekunden Verspätung
        let descriptionElement0 = widget.addText(
          linie0 + " -> " + ziel0 + " " + plan0[3] + "  +" + secdelay + "sec"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.yellow();
      } else if (secdelay == 0) {
        //Wenn glatte Minute Verspätung
        let descriptionElement0 = widget.addText(
          linie0 + " -> " + ziel0 + " " + plan0[3] + "  +" + mindelay + "min"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.red();
      } else {
        //Verspätung von Minuten und Sekunden
        let descriptionElement0 = widget.addText(
          linie0 +
            " -> " +
            ziel0 +
            " " +
            plan0[3] +
            "  +" +
            mindelay +
            ":" +
            secdelay +
            "min"
        );
        descriptionElement0.minimumScaleFactor = 0.5;
        descriptionElement0.font = Font.systemFont(18);
        descriptionElement0.textColor = Color.red();
      }
    } else {
      //Pünktlich (0:00)
      let descriptionElement0 = widget.addText(
        linie0 + " -> " + ziel0 + " " + plan0[3] + "  +0:00min"
      );
      descriptionElement0.textColor = Color.green();
      descriptionElement0.minimumScaleFactor = 0.5;
      descriptionElement0.font = Font.systemFont(18);
    }

    ///////////////////
    ////2. ZEILE///////
    ///////////////////

    if (delaytime1[2] > 0 || delaytime1[2] < 0) {
      //WENN Verspätung oder Verfrühung
      var mindelay = Math.floor((delaytime1[2] % 3600) / 60);
      var secdelay = Math.floor((delaytime1[2] % 3600) % 60);

      if (mindelay == 0) {
        //Wenn nur Sekunden Verspätung
        let descriptionElement1 = widget.addText(
          linie1 + " -> " + ziel1 + " " + plan1[3] + "  +" + secdelay + "sec"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.yellow();
      } else if (secdelay == 0) {
        //Wenn glatte Minute Verspätung
        let descriptionElement1 = widget.addText(
          linie1 + " -> " + ziel1 + " " + plan1[3] + "  +" + mindelay + "min"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.red();
      } else {
        //Verspätung von Minuten und Sekunden
        let descriptionElement1 = widget.addText(
          linie1 +
            " -> " +
            ziel1 +
            " " +
            plan1[3] +
            "  +" +
            mindelay +
            ":" +
            secdelay +
            "min"
        );
        descriptionElement1.minimumScaleFactor = 0.5;
        descriptionElement1.font = Font.systemFont(18);
        descriptionElement1.textColor = Color.red();
      }
    } else {
      //Pünktlich (0:00)
      let descriptionElement1 = widget.addText(
        linie1 + " -> " + ziel1 + " " + plan1[3] + "  +0:00min"
      );
      descriptionElement1.textColor = Color.green();
      descriptionElement1.minimumScaleFactor = 0.5;
      descriptionElement1.font = Font.systemFont(18);
    }
  }
  /*

  const d = new Date()
let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

  let timetext = widget.addText("Letzte Aktualisierung: " + time);
  timetext.textColor = Color.lightGray()*/
  // UI presented in Siri ans Shortcuta is non-interactive, so we only show the footer when not running the script from Siri.
  if (!config.runsWithSiri) {
    widget.addSpacer(8);
    // Add button to open documentation
    let linkSymbol = SFSymbol.named("arrow.up.forward");
    let footerStack = widget.addStack();
    let linkStack = footerStack.addStack();
    linkStack.centerAlignContent();
    linkStack.url = "https://github.com/Tjum208/Abfahrtsmonitor-VGN";
    let linkElement = linkStack.addText("GitHub");
    linkElement.font = Font.mediumSystemFont(13);
    linkElement.textColor = Color.blue();
    linkStack.addSpacer(3);
    let linkSymbolElement = linkStack.addImage(linkSymbol.image);
    linkSymbolElement.imageSize = new Size(11, 11);
    linkSymbolElement.tintColor = Color.blue();
    footerStack.addSpacer();
    // Add link to documentation
    /*
    let docsSymbol = SFSymbol.named("book");
    let docsElement = footerStack.addImage(docsSymbol.image);
    docsElement.imageSize = new Size(20, 20);
    docsElement.tintColor = Color.white();
    docsElement.imageOpacity = 0.5;
    docsElement.url = "https://github.com/Tjum208/Abfahrtsmonitor-VGN";
    */
  }
  return widget;
}

//FUNCTIONS

async function delay(time) {
  var hourssoll = time[0] * 3600;
  var minsoll = time[1] * 60;
  var secsoll = time[2] * 1;
  var hoursist = time[3] * 3600;
  var minist = time[4] * 60;
  var secist = time[5] * 1;
  var soll = hourssoll + minsoll + secsoll;
  var ist = hoursist + minist + secist;
  var delay = ist - soll;
  return [soll, ist, delay];
}

async function loadDocs([numhst, product]) {
  console.log("Test");
  let url = `https://start.vag.de/dm/api/v1/abfahrten/VGN/${numhst}?product=${product}&timespan=100&limitcount=50`;
  let req = await new Request(url);
  return await req.loadJSON();
}

async function linienname([x, hst]) {
  var linie = hst.Abfahrten[x].Linienname;
  console.log("Test func");
  return linie;
}

async function dest([x, hst]) {
  var linie = hst.Abfahrten[x].Richtungstext;
  return linie;
}

async function timecalc(hsttest) {
  // let ist = hst[11] +  hst[12] + hst[13] + hst[14] + hst[15] + hst[16] + hst[17] + hst[18]
  let h = hsttest[11] + hsttest[12];
  let m = hsttest[14] + hsttest[15];
  let s = hsttest[17] + hsttest[18];
  let full = h + ":" + m; //+ ":" + s
  return [h, m, s, full];
}

function checkupline([hst, linie]) {
  console.log("Gesuchte Linie:" + linie);
  var linecount = hst.Abfahrten.length;
  console.log("Maximal gefundene Abfahrten: " + linecount);
  if (line == 0) {
    return "error";
  } else {
    if (hst.Abfahrten[0].Linienname == linie) {
      var result1 = 0;

      for (let cnt = 1; hst.Abfahrten[cnt].Linienname != linie && linecount >= cnt && fehler != 1; cnt++) {
        var next = cnt + 1;
        if (next == linecount - 1) {
          console.log("KEINE ABFAHRTEN FÜR LINIE " + linie);
          return "error";
        }
        var result2 = cnt + 1;
      }
    } else {
      for (let ply = 0; hst.Abfahrten[ply].Linienname != linie && linecount >= ply; ply++) {
        if (ply == linecount - 1) {
          console.log("KEINE ABFAHRTEN FÜR LINIE " + linie);
          var fehler = 1;
          return "error";
        }
        var result1 = ply + 1;
        var fehler = 0;
      }
      for (
        let cnt = result1 +1; hst.Abfahrten[cnt].Linienname != linie && linecount >= cnt && fehler != 1; cnt++) {
        if (cnt == linecount - 1) {
          console.log("KEINE ABFAHRTEN FÜR LINIE " + linie);
          var result2 = next + 1
          return //"error";
        }
        var result2 = cnt + 1;
      }
    }
    return [result1, result2];
  }
}

async function loadAppIcon() {
  let url = "https://i.postimg.cc/prN2qqZQ/vgn-trans.png";
  let req = new Request(url);
  return req.loadImage();
}
