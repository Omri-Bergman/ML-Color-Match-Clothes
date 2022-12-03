//String[] species = { "Capra hircus", "Panthera pardus", "Equus zebra" };
//String[] names = { "Goat", "Leopard", "Zebra" };

//JSONArray values;

//void setup() {

//  values = new JSONArray();

//  for (int i = 0; i < species.length; i++) {

//    JSONObject animal = new JSONObject();

//    animal.setInt("id", i);
//    animal.setString("species", species[i]);
//    animal.setString("name", names[i]);

//    values.setJSONObject(i, animal);
//  }

//  saveJSONArray(values, "data/new.json");
//}

PImage img;
Table table;
JSONArray values;
int count = 0;
int count_images = 0;
void setup() {
  //size(1280, 960);
  //table = loadTable("data/pants_labels.csv", "header");
  table = loadTable("data/shirts_labels.csv", "header");

  values = new JSONArray();

  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 7; j++) {
      img = loadImage("data/shirt_"+i+"/shirt_"+i+"_"+j+".jpg");
      //img = loadImage("data/pants_"+i+"/pants_"+i+"_"+j+".jpg");
      insert_to_json( table, values, img, count_images);
      count_images++;
    }
  }

  //img = loadImage("data/shirt_1/shirt_1_6.jpg");
  //insert_to_json( table, values, img, 13);
  //img = loadImage("data/shirt_2/shirt_2_4.jpg");
  //insert_to_json( table, values, img, 14);


  //saveJSONArray(values, "data/shirts_data_RGB.json");
  //saveJSONArray(values, "data/pants_data_RGB.json");

  println("count: ", count);
  println("DONE :)");
}

void insert_to_json(Table table, JSONArray values, PImage img, int row_num) {

  TableRow row = table.getRow(row_num);

  //TL = TOP LEFT, BR = BOTTOM RIGHT
  int TL_X = row.getInt("A");
  int TL_Y = row.getInt("B");
  int BR_X = row.getInt("C");
  int BR_Y = row.getInt("D");
  int img_w = row.getInt("Width");
  int img_h = row.getInt("Height");
  String label = row.getString("Label");
  String image = row.getString("Image");
  println(image);
  int c = 0;
  //println("image: ", image, "TL_X: ",TL_X,"TL_Y: ", TL_Y, "BR_X: ",BR_X, "BR_Y: ",BR_Y, "img.width: ", img.width, "img_w: ", img_w);
  //println("TL_X: ", TL_X, "TL_Y: ", TL_Y, "BR_X: ", BR_X, "BR_Y: ", BR_Y, "W :", TL_X+(BR_X-TL_X), "H: ", TL_Y+(BR_Y-TL_Y));

  img.loadPixels();
  loadPixels();

  int step = 8;

  if (TL_X > BR_X) {
    for (int x = TL_X; x < TL_X+BR_X; x+=step/2) {
      for (int y = TL_Y; y < TL_Y+BR_Y; y+=step/2) {
        int loc = x + y*img.width;
        //point(x, y);
        int r, g, b, brightness, hue, saturation;
        r = (int)red (img.pixels[loc]);
        g = (int)green (img.pixels[loc]);
        b = (int)blue (img.pixels[loc]);
        brightness =(int) brightness(img.pixels[loc]);
        hue = (int)hue(img.pixels[loc]);
        saturation = (int)saturation(img.pixels[loc]);
        JSONObject rgb = new JSONObject();

        rgb.setInt("r", r);
        rgb.setInt("g", g);
        rgb.setInt("b", b);
        //rgb.setInt("h", hue);
        //rgb.setInt("s", saturation);
        //rgb.setInt("brightness", brightness);
        rgb.setString("label", label);
        rgb.setString("image", image);
        values.setJSONObject(count, rgb);
        count++;
        c++;
      }
    }
  } else {
    for (int x = TL_X; x < TL_X+(BR_X-TL_X); x+=step) {
      for (int y = TL_Y; y < TL_Y+(BR_Y-TL_Y); y+=step) {
        //for (int x = TL_X; x < TL_X+BR_X; x+=step) {
        //  for (int y = TL_Y; y < TL_Y+BR_Y; y+=step) {
        int loc = x + y*img.width;
        noStroke();
        fill(0);
        //ellipse(x, y, 3, 3);
        //point(x,y);
        int r, g, b, brightness, hue, saturation;
        r = (int)red (img.pixels[loc]);
        g = (int)green (img.pixels[loc]);
        b = (int)blue (img.pixels[loc]);
        //brightness =(int) brightness(img.pixels[loc]);
        //hue = (int)hue(img.pixels[loc]);
        //saturation = (int)saturation(img.pixels[loc]);
        JSONObject rgb = new JSONObject();

        rgb.setInt("r", r);
        rgb.setInt("g", g);
        rgb.setInt("b", b);
        //rgb.setInt("h", hue);
        //rgb.setInt("s", saturation);
        //rgb.setInt("brightness", brightness);
        rgb.setString("label", label);
        rgb.setString("image", image);
        values.setJSONObject(count, rgb);
        count++;
        c++;
      }
    }
  }

  /////
  //dots( table, values, img, row_num);
  ///////
  println(image, c);
}

void dots(Table table, JSONArray values, PImage img, int row_num) {
  image(img, 0, 0);


  TableRow row = table.getRow(row_num);

  //TL = TOP LEFT, BR = BOTTOM RIGHT
  int TL_X = row.getInt("A");
  int TL_Y = row.getInt("B");
  int BR_X = row.getInt("C");
  int BR_Y = row.getInt("D");
  int img_w = row.getInt("Width");
  int img_h = row.getInt("Height");
  String label = row.getString("Label");
  String image = row.getString("Image");
  int c = 0;
  //println("image: ", image, "TL_X: ",TL_X,"TL_Y: ", TL_Y, "BR_X: ",BR_X, "BR_Y: ",BR_Y, "img.width: ", img.width, "img_w: ", img_w);
  //println("TL_X: ", TL_X, "TL_Y: ", TL_Y, "BR_X: ", BR_X, "BR_Y: ", BR_Y, "W :", TL_X+(BR_X-TL_X), "H: ", TL_Y+(BR_Y-TL_Y));

  img.loadPixels();
  loadPixels();

  int step = 8;
  for (int x = TL_X; x < TL_X+BR_X; x+=step) {
    for (int y = TL_Y; y < TL_Y+BR_Y; y+=step) {
      int loc = x + y*img.width;
      noStroke();
      fill(0);
      ellipse(x, y, 3, 3);
      //point(x,y);
      int r, g, b, brightness, hue, saturation;
      r = (int)red (img.pixels[loc]);
      g = (int)green (img.pixels[loc]);
      b = (int)blue (img.pixels[loc]);
      //brightness =(int) brightness(img.pixels[loc]);
      //hue = (int)hue(img.pixels[loc]);
      //saturation = (int)saturation(img.pixels[loc]);
      JSONObject rgb = new JSONObject();

      rgb.setInt("r", r);
      rgb.setInt("g", g);
      rgb.setInt("b", b);
      //rgb.setInt("h", hue);
      //rgb.setInt("s", saturation);
      //rgb.setInt("brightness", brightness);
      rgb.setString("label", label);
      rgb.setString("image", image);
      values.setJSONObject(count, rgb);
      count++;
      c++;
    }
  }

  int r, g, b, brightness, hue, saturation;
  int count = 0;
  for (int x = TL_X; x < TL_X+BR_X; x+=step) {
    for (int y = TL_Y; y < TL_Y+BR_Y; y+=step) {
      int loc = x + y*img.width;
      fill(250);
      noStroke();
      //ellipse(x, y, 3, 3);
      r = (int)red (img.pixels[loc]);
      g = (int)green (img.pixels[loc]);
      b = (int)blue (img.pixels[loc]);
      fill(r, g, b);
      stroke(0.1);
      int x_p = (int)map(x, TL_X, TL_X+BR_X, 0, width);
      int y_p = (int)map(y, TL_Y, TL_Y+BR_Y, 0, height);
      //int x_n = (int)map(x,0,width,0,1276);
      //int y_n = (int)map(y, 0 ,height,0,964);
      rect(x_p, y_p, 15, 15);
      count++;
      println("x_p: ", x_p, "y_p: ", y_p);
      //if (count ==2000) {
      //  //   fill(250);
      //  //ellipse(x, y, 3, 3);
      //  println("R: ", r, "G: ", g, "B: ", b);
      //  return;
      //}
    }
  }
}
