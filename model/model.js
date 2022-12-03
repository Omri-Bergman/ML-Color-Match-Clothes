let data;
let model;
let xs, ys;
let rSlider, gSlider, bSlider;
let labelP;
let lossP;

let labelList = [
  'shirt_0',
  'shrit_1',
  'shirt_2',
  'shirt_3',
  'shirt_4'
];

let pants_labelList = [
  'pants_0',
  'pants_1',
  'pants_2',
  'pants_3'
];

function preload() {
  //data = loadJSON('data_shuffle2.json');
  data = loadJSON('shirts_data_RGB_shuffle.json');// CHANGE FOR SHIRTS/PANTS
}

function setup() {
  // Crude interface
  //labelP = createP('label');
  //lossP = createP('loss');
  //rSlider = createSlider(0, 255, 255);
  //gSlider = createSlider(0, 255, 0);
  //bSlider = createSlider(0, 255, 255);
  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    //rgbhsb
    //let col = [record.r/255, record.g/255, record.b/255, record.h/255, record.s/255, record.brightness/255 ];
    //rgb
    let col = [record.r/255, record.g/255, record.b/255];

    colors.push(col);
    //labels.push(pants_labelList.indexOf(record.label)); //FOR PANTS
    labels.push(labelList.indexOf(record.label)); // FOR SHIRTS
  }
  console.log(labels);

  xs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, 'int32');

  ys = tf.oneHot(labelsTensor, 5).cast('float32');// CHANGE FOR SHIRTS/PANTS
  labelsTensor.dispose();

  //console.log(xs.shape);
  //console.log(ys.shape);
  //xs.print();
  //ys.print();
  model = tf.sequential();
  const hidden = tf.layers.dense( {
  units:
    16,
    inputShape:
    [3],
    activation:
    'sigmoid'
  }
  );
  const output = tf.layers.dense( {
  units:
    5, // CHANGE FOR SHIRTS/PANTS
    activation:
    'softmax'
  }
  );
  model.add(hidden);
  model.add(output);

  const LEARNING_RATE = 0.25;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  model.compile( {
  optimizer:
    optimizer,
    loss:
    'categoricalCrossentropy',
    metrics:
    ['accuracy']
  }
  );

  //const options = {
  // epochs: 2,
  // validationSplit: 0.10,
  // shuffle: true
  //}
  //model.fit(xs, ys, options).then(results => {
  //  console.log(results)
  //}
  //);
  train();
}


async function train() {
  await model.fit(xs, ys, {
  epochs:
    35,
    validationSplit:
    0.15,
    shuffle:
    true,
    callbacks:
    {
    onTrainBegin:
      () => console.log('training start'),
      onTrainEnd:
      () => console.log('training DOne'),
        //onBatchEnd:tf.nextFrame,
      onEpochEnd:
      async (num, logs) => {
        console.log('Epoch: ' + num);
        console.log('Loss: ' + logs.loss);
        console.log('val_Loss: ' + logs.val_loss);
        console.log('accuracy: ' + logs.val_acc);
      }
    }
  }
  );
  await model.save('downloads://my-model');
  //await model.save('localstorage://my-model');
  console.log('SAVED');
}
function draw() {
  strokeWeight(2);
  stroke(255);
  //line(frameCount % width, 0, frameCount % width, height);
  let r = 221;
  let g =23;
  let b = 88;
  //let h =190;
  //let s = 100;
  //let brightness = 54;
  background(r, g, b);
  tf.tidy(() => {
    const xs = tf.tensor2d([[r/255, g/255, b/255]]);
    let results = model.predict(xs);
    let index = results.argMax(1).dataSync()[0];
    
    let label = labelList[index];// CHANGE FOR SHIRTS/PANTS
    console.log(label);
  }
  );
}



//async function train() {
//  // This is leaking https://github.com/tensorflow/tfjs/issues/457
//  await model.fit(xs, ys, {
//  shuffle:
//    true,
//    validationSplit:
//    0.1,
//    epochs:
//    1,
//    callbacks:
//    {
//    onEpochEnd:
//      (epoch, logs) => {
//        console.log(epoch);
//        lossP.html('loss: ' + logs.loss.toFixed(5));
//      }
//      ,
//      onBatchEnd:
//      async (batch, logs) => {
//        await tf.nextFrame();
//      }
//      ,
//      onTrainEnd:
//      () => {
//        console.log('finished');
//      }
//    }
//  }
//  );
//}

//function draw() {
//  let r = rSlider.value();
//  let g = gSlider.value();
//  let b = bSlider.value();
//  background(r, g, b);
//  strokeWeight(2);
//  stroke(255);
//  line(frameCount % width, 0, frameCount % width, height);
//  tf.tidy(() => {
//    const input = tf.tensor2d([[r, g, b]]);
//    let results = model.predict(input);
//    let argMax = results.argMax(1);
//    let index = argMax.dataSync()[0];
//    let label = labelList[index];
//    labelP.html(label);
//  }
//  );
//}
