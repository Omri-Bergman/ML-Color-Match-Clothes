

let labelList = [
  'shirt_0',
  'shrit_1',
  'shirt_2',
  'shirt_3',
  'shirt_4',
  'shirt_5'
];


let pants_labelList = [
  'pants_0',
  'pants_1',
  'pants_2',
  'pants_3'
];



let model_s;
let model_p;
let video;
let poseNet;
let pose;
let skeleton;
let label_s, label_p;
let prev_label_s, prev_label_p;
let R, G, B, A, RGB;
let img_bad, img_good, img_half;
let animate = false;
let VIDEO_WIDTH, VIDEO_HEIGHT;
let IMG_SIZE = 100;
let COLOR_A = (44, 46, 67);
let COLOR_B = (89, 82, 96);
let COLOR_C = (178, 177, 185);
let COLOR_D = (255, 213, 35);
let NUM_OF_SHIRTS = 5;
let NUM_OF_PANTS = 4;
let shirts_imgs = [];
let pants_imgs = [];
let prev_score = 1;
let score = prev_score;
let good_num =  Math.floor(prev_score/2);
let half_num = prev_score%2;
let bad_num =  5-(good_num+half_num);
let imgs_num_lst = [bad_num, half_num, good_num];
let score_list = [7, 8, 10, 8, 9, 2, 4, 9, 4, 8, 1, 3, 9, 5, 8, 5, 9, 10, 1, 8];
let best_pants = 0; //TODO change to none
let best_shirt = 0;




async function preload() {
  model_s = await tf.loadLayersModel("http://localhost:5000/data/shirts/my-model.json");
  model_p = await tf.loadLayersModel("http://localhost:5000/data/pants/my-model.json");
  img_bad = loadImage('data/bad.png');
  img_bad.resize(IMG_SIZE, IMG_SIZE);
  img_good = loadImage('data/good.png');
  img_good.resize(IMG_SIZE, IMG_SIZE);
  img_half = loadImage('data/half.png');
  img_half.resize(IMG_SIZE, IMG_SIZE);
  for (let i = 0; i < NUM_OF_SHIRTS; i++) {
    shirts_imgs[i] = loadImage("data/img_sampels/shirt_" + i + ".jpg");
  }
  for (let i = 0; i < NUM_OF_PANTS; i++) {
    pants_imgs[i] = loadImage("data/img_sampels/pants_" + i + ".jpg");
  }
  console.log('LOADED');
}


function setup() {
  createCanvas(1227, 576);
  //createCanvas(1535, 721);
  //createCanvas(displayWidth, displayHeight*0.835);
  video = createCapture(VIDEO);

  //VIDEO_WIDTH = width*0.5;
  VIDEO_WIDTH = width*0.63; //HEIGHT ALL SCREEN
  VIDEO_HEIGHT = VIDEO_WIDTH*0.75;

  // VIDEO_WIDTH = 640;
  //VIDEO_HEIGHT = 480;
  console.log("width: ", width);
  console.log("height: ", height);
  console.log("vid wid: ", VIDEO_WIDTH);
  console.log("vid heigh: ", VIDEO_HEIGHT);


  video.size(VIDEO_WIDTH, VIDEO_HEIGHT);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  pixelDensity(1);
  //load();
  textFont("monospace", 35);
}

function modelLoaded() {
  console.log("poseNet ready");
}


function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  background(211);
  //image(video, 0, height - VIDEO_HEIGHT);
  image(video, 0, 0);
  video.loadPixels();
  if (pose) {
     //get_labels();
    if (!animate) {
      get_labels();
      if (label_s && label_p) {
        animate = true;
      }
    } else {
      if (label_s && label_p) {
        let pos = parseInt(label_s.substr(label_s.length - 1)) + parseInt((label_p.substr(label_p.length - 1)) * NUM_OF_SHIRTS);
        score = score_list[pos];
        if (score != prev_score) {
          good_num =  Math.floor(prev_score/2);
          half_num = prev_score%2;
          bad_num =  5-(good_num+half_num);
          imgs_num_lst = [bad_num, half_num, good_num];
          prev_score += 1* Math.sign(score - prev_score)
        } else {
          animate = false;
        }
      }
    }
    drawgons(imgs_num_lst);
    draw_suggestions();
  }
}

function draw_suggestions() {
  if (label_s && label_p) {
    if (label_s && label_p && label_s != prev_label_s) {
      best_pants = make_suggestions_shirts();
      prev_label_s = label_s;
    }
    if (label_s && label_p  && label_p != prev_label_p) {
      best_shirt = make_suggestions_pants();
      prev_label_p = label_p;
    }
    imageMode(CENTER);
    rectMode(CENTER);
    noStroke();
    //fill(89, 82, 96);
    fill(47, 79, 79);
    //let w = width*0.75;
    let w = VIDEO_WIDTH+((width-VIDEO_WIDTH)/2);
    let step = (width-VIDEO_WIDTH)/5;

    //rect(w, 3*step, 220, 220);
    //rect(w, 3*step+250, 220, 220);
    pants_num =  parseInt((label_p.substr(label_p.length - 1)));
    shirt_num = parseInt(label_s.substr(label_s.length - 1));
    let size= w*.15;
    noStroke();
    rect(VIDEO_WIDTH+(w-VIDEO_WIDTH)/2, 3*step+size*1.1, size*1.1, size*1.1);
    image(shirts_imgs[best_shirt], VIDEO_WIDTH+(w-VIDEO_WIDTH)/2, 3*step, size, size);
    image(pants_imgs[pants_num], VIDEO_WIDTH+(w-VIDEO_WIDTH)/2, 3*step+size*1.1, size, size);

    rect( w+(width-w)/2, 3*step, size*1.1, size*1.1);
    image(shirts_imgs[shirt_num], w+(width-w)/2, 3*step, size, size);
    image(pants_imgs[best_pants], w+(width-w)/2, 3*step+size*1.1, size, size);
    rectMode(CORNER);
    imageMode(CORNER);

    if (pose.leftWrist.y <  pose.nose.y) {
      console.log("cur shirt: ", label_s);
      console.log("cur pants: ", label_p);
      ////background(255);
      let left_shoulder = pose.leftShoulder;
      let right_shoulder = pose.rightShoulder;
      let left_hip = pose.leftHip;
      let right_hip = pose.rightHip;
      let right_shoulder_y = Math.floor(right_shoulder.y);
      let right_shoulder_x = Math.floor(right_shoulder.x);
      let right_hip_y = Math.floor(right_hip.y);
      let left_shoulder_x = Math.floor(left_shoulder.x);
      image(shirts_imgs[best_shirt], right_shoulder.x-25, right_shoulder.y-25, (left_shoulder.x -right_shoulder.x)+30, right_hip.y-right_shoulder.y)+30;
    }
  }
}

function make_suggestions_shirts() {
  shirt_num = parseInt(label_s.substr(label_s.length - 1));
  pants_num =  parseInt((label_p.substr(label_p.length - 1)));
  let best_fit_for_shirts = [0, 0];
  for (let i = shirt_num; i < NUM_OF_PANTS*NUM_OF_SHIRTS; i+=NUM_OF_SHIRTS) {
    if (score_list[i] > best_fit_for_shirts[1] && (Math.floor(i/NUM_OF_SHIRTS))!=pants_num) {
      best_fit_for_shirts[0]=(Math.floor(i/NUM_OF_SHIRTS));
      best_fit_for_shirts[1] = score_list[i];
    }
  }
  return best_fit_for_shirts[0];
}

function make_suggestions_pants() {
  pants_num =  parseInt((label_p.substr(label_p.length - 1)));
  shirt_num = parseInt(label_s.substr(label_s.length - 1));
  pants_first_idx = pants_num * NUM_OF_SHIRTS;
  let best_fit_for_pants = [0, 0];
  for (let i = pants_first_idx; i < pants_first_idx + NUM_OF_SHIRTS; i++) {
    if (score_list[i] > best_fit_for_pants[1] && i%NUM_OF_SHIRTS!=shirt_num) {
      best_fit_for_pants[0]=i%NUM_OF_SHIRTS;
      best_fit_for_pants[1] = score_list[i];
    }
  }
  return best_fit_for_pants[0];
}


function drawgons(imgs_num_lst) {
  let dragons_imgs_lst = [img_bad, img_half, img_good];
  let count_img = 0;
  let step_list =[];

  let step = (width-VIDEO_WIDTH)/5;
  //let dragon_size = Math.min(step, height - VIDEO_HEIGHT);
  for (img = 0; img < dragons_imgs_lst.length; img++) {
    for ( let i = 0; i < imgs_num_lst[img]; i++) {
      //image(imgs_lst[img], video.width+count_img*step, 0, step, step);
      image(dragons_imgs_lst[img], VIDEO_WIDTH + count_img*step, 0, step, step);
      count_img++;
    }
  }
  //fill(0, 100);
  //stroke(COLOR_C);
  //strokeWeight(8);
  //line(VIDEO_WIDTH, 0, VIDEO_WIDTH, height);
  //line(0, height - VIDEO_HEIGHT, VIDEO_WIDTH, height - VIDEO_HEIGHT);
  ////rect(0, 0, VIDEO_WIDTH, height - VIDEO_HEIGHT);
  //fill(249, 90, 90);
  fill(47, 79, 79);
  ////rect(width*2, height/12,width/2,height/3);
  noStroke();
  textAlign(CENTER, CENTER);
  text("Try these together:", VIDEO_WIDTH, step, width-VIDEO_WIDTH, step);
}


function get_labels() {
  let ret = get_shirt_color();
  if (ret != -1) {
    [R, G, B, A] = ret.split(',');
    //fill(R, G, B);
    //rect(0, 0, 100, 100);
    if (model_s) {
      //console.log(model);
      tf.tidy(() => {
        //const xs = tf.tensor2d([[R/255, G/255, B/255, h/255, s/255, br/255 ]]);
        const xs = tf.tensor2d([[R/255, G/255, B/255]]);
        let results = model_s.predict(xs);
        let index = results.argMax(1).dataSync()[0];
        label_s = labelList[index];
        //console.log("SHIRT: ", label_s);
      }
      );
    }
  }
  let ret_p =  get_pants_color();
  if (ret_p != -1) {
    [R, G, B, A] = ret_p.split(',');
    //fill(R, G, B);
    //rect(0, 100, 100, 100);
    if (typeof(parseInt(R)) == typeof(3) ) {
      if (model_s) {
        //console.log(model);
        tf.tidy(() => {
          //const xs = tf.tensor2d([[R/255, G/255, B/255, h/255, s/255, br/255 ]]);
          const xs = tf.tensor2d([[R/255, G/255, B/255]]);
          let results = model_p.predict(xs);
          let index = results.argMax(1).dataSync()[0];
          label_p = pants_labelList[index];
          //console.log("PANTS: ", label_p);
        }
        );
      }
    }
  }
}

function get_pants_color() {
  let R = 0;
  let B = 0;
  let G = 0;
  let count = 0;
  let dict = {};

  let left_hip = pose.leftHip;
  let right_hip = pose.rightHip;
  let left_knee = pose.leftKnee;
  let right_knee = pose.rightKnee;


  video.loadPixels();
  let right_hip_y = Math.floor(right_hip.y);
  let right_hip_x = Math.floor(right_hip.x);
  let right_knee_y = Math.floor(right_knee.y);
  let left_hip_x = Math.floor(left_hip.x);
  for (let y =right_hip_y; y <right_hip_y + (right_knee_y-right_hip_y); y+=5) {
    for (let x = right_hip_x; x <right_hip_x+(left_hip_x-right_hip_x); x+=5) {
      //noStroke();
      //fill(255);
      //circle(x, y, 5);
      //point(x, y);
      let index = (y * video.width + x) * 4;
      let rgba = [
        video.pixels[index],
        video.pixels[index + 1],
        video.pixels[index + 2],
        video.pixels[index + 3]
      ];
      if (rgba) {
        count++;
        if (rgba[0] >= 0) {
          dict[rgba] = (dict[rgba] || 0) + 1;
        }
      }
    }
  }
  return Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b, -1);
  return  -1;
}



function get_shirt_color() {
  let R = 0;
  let B = 0;
  let G = 0;
  let count = 0;
  let dict = {};

  let left_shoulder = pose.leftShoulder;
  let right_shoulder = pose.rightShoulder;
  let left_hip = pose.leftHip;
  let right_hip = pose.rightHip;

  video.loadPixels();
  let right_shoulder_y = Math.floor(right_shoulder.y);
  let right_shoulder_x = Math.floor(right_shoulder.x);
  let right_hip_y = Math.floor(right_hip.y);
  let left_shoulder_x = Math.floor(left_shoulder.x);
  for (let y =right_shoulder_y; y <right_shoulder_y + (right_hip_y-right_shoulder_y); y+=5) {
    for (let x = right_shoulder_x; x <right_shoulder_x+(left_shoulder_x-right_shoulder_x); x+=5) {
      //noStroke();
      //fill(255);
      //circle(x, y, 5);
      //point(x, y);
      //circle(x, y, 5);
      let index = (y * video.width + x) * 4;
      let rgba = [
        video.pixels[index],
        video.pixels[index + 1],
        video.pixels[index + 2],
        video.pixels[index + 3]
      ];
      if (rgba) {
        count++;
        if (rgba[0] >= 0) {
          dict[rgba] = (dict[rgba] || 0) + 1;
        }
      }
    }
  }
  return Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b, -1);
  return  -1;
}
