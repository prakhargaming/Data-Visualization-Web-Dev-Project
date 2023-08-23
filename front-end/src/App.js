import "./App.css";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar"
import { Box, Stack, Typography, Button } from "@mui/material";
import Navbar from "./components/Navbar"
import LassoChartL from "./components/scatterplotL"


function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);
  
  const embeddings = [
      [ 5.8830816e-01, -1.0662376e+00],
      [ 2.2068832e+00, -6.1704642e-01],
      [-3.9335397e-01,  2.4787757e+00],
      [ 3.4450307e+00, -1.5581744e+00],
      [-1.7193385e+00, -1.3585700e+00],
      [ 7.2822821e-01,  4.0388465e+00],
      [-7.0312536e-01,  3.6477158e+00],
      [ 4.1002402e+00,  7.9619505e-02],
      [-5.8757186e-01,  3.6768107e+00],
      [-1.9244497e+00,  1.2159057e+00],
      [-6.8993074e-01, -1.4854709e+00],
      [ 2.6903221e-01,  3.8569574e+00],
      [ 1.7391416e+00,  2.7635844e+00],
      [-5.3442464e+00,  2.1529372e+00],
      [ 1.3615773e+00,  3.3456284e-01],
      [-2.6908371e-01, -2.9079220e+00],
      [ 4.8582900e-01, -5.1400822e-01],
      [ 1.7898320e+00, -8.4523863e-01],
      [-3.4683785e+00,  4.5592375e+00],
      [ 1.0548605e+00,  4.2639432e+00],
      [ 3.3009071e+00,  2.1652486e+00],
      [-3.1946776e+00,  3.0727432e+00],
      [ 1.1345544e+00, -1.5015808e-01],
      [-2.3635225e+00,  1.3850421e+00],
      [ 2.5940506e+00,  2.3233533e+00],
      [-4.1422048e+00,  2.1500115e+00],
      [ 8.3295667e-01,  2.3093071e+00],
      [-2.9451349e+00, -9.7227685e-02],
      [-5.5441275e+00,  2.1575487e+00],
      [-2.0048025e+00, -1.9839342e+00],
      [-2.4996152e+00, -4.1875497e-01],
      [ 1.2016895e+00, -3.0539305e+00],
      [ 1.0051973e-02,  2.1802361e+00],
      [-3.2455626e-01,  4.1553092e-01],
      [ 1.1976906e+00,  1.6336490e-01],
      [-1.5498866e+00,  2.6909673e+00],
      [-8.6505479e-01,  7.2664696e-01],
      [ 2.3612802e+00, -2.4878342e+00],
      [-1.9084121e+00, -6.8022572e-02],
      [-2.1676035e+00,  5.9628941e-02],
      [ 6.4002222e-01,  2.6520882e+00],
      [ 9.2858779e-01,  5.1913319e+00],
      [ 4.2242646e-01,  2.2024601e+00],
      [ 1.0093446e+00,  5.0440497e+00],
      [ 4.4912276e+00,  1.7588188e-01],
      [-1.3010210e+00,  3.0177593e+00],
      [ 2.2566688e+00,  1.5540478e-01],
      [ 2.5268004e+00, -2.6337142e+00],
      [ 1.0754873e+00,  1.5782361e+00],
      [-2.4336274e-01, -5.6897050e-01],
      [-6.9890642e-01,  1.7537715e+00],
      [ 2.6420569e+00, -1.0187204e+00],
      [-1.1227673e+00,  2.0159798e+00],
      [ 9.9657917e-01, -3.6979921e+00],
      [ 1.6538924e+00, -1.5308732e+00],
      [-2.0066395e+00, -1.4816570e+00],
      [-4.4098501e+00,  3.1317136e+00],
      [-2.2036433e+00,  2.2439954e+00],
      [-5.6335897e+00,  3.5626271e+00],
      [-5.0268784e+00,  2.4155822e+00],
      [ 2.4940395e+00,  6.9811410e-01],
      [ 7.0487380e-01, -1.8012353e+00],
      [ 3.4610708e+00, -1.0786544e+00],
      [-3.1469233e+00,  1.8489608e+00],
      [-2.1514577e-01,  1.3294436e+00],
      [ 2.8730140e+00,  2.7311146e-01],
      [ 1.3464864e+00,  1.5497766e+00],
      [-8.6211866e-01,  5.3522506e+00],
      [-1.5472045e+00,  3.4546721e-01],
      [-7.8746467e+00,  5.2985877e-01],
      [-6.4110885e+00, -9.3956597e-02],
      [-6.8554926e+00,  1.6861851e+00],
      [-7.0053473e+00, -1.9907167e+00],
      [-6.5196981e+00,  1.9256619e+00],
      [-6.3609595e+00,  1.3762220e+00],
      [-6.7542949e+00, -2.6558604e+00],
      [-7.3241639e+00,  1.9549018e+00],
      [-6.3487072e+00,  3.0307350e+00],
      [-7.4677196e+00,  3.7493680e+00],
      [-6.5275612e+00,  6.0528946e-01],
      [-7.7135229e+00,  1.2677258e+00],
      [-6.9864826e+00,  3.4333668e+00],
      [-7.4731536e+00, -1.7944994e+00],
      [-7.0304770e+00, -6.6726655e-04],
      [-6.5740747e+00,  2.1655989e+00],
      [-7.0004973e+00, -9.4808914e-02],
      [-6.4756694e+00,  6.0891128e-01],
      [-6.8002186e+00, -2.5983875e+00],
      [-6.7019563e+00,  3.4497845e+00],
      [-7.6797376e+00,  3.8074801e+00],
      [-6.9196291e+00, -2.2883964e+00],
      [ 6.5376180e-01, -9.4269574e-01],
      [ 1.3883547e-01,  5.8263505e-01],
      [-4.6873240e+00,  7.8537476e-01],
      [-3.2702627e+00,  9.8994619e-01],
      [ 1.0857917e+00,  5.6112170e-01],
      [ 2.6110330e+00,  1.3345430e+00],
      [ 4.9078438e-01,  6.8135822e-01],
      [ 8.9021760e-01,  1.2976936e+00],
      [-5.1926012e+00,  9.0102619e-01],
      [-3.3808081e+00,  1.0273950e+00]
  ];

  const numClasses = 5

  const imagePathsStr = "./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0009_34.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0074_59.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0014_89.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0031_100.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0010_796097.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0023_796059.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0040_796066.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0089_796069.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0067_170.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0060_796076.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0056_796078.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0080_796096.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0017_796098.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0019_796104.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0057_796106.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0041_796108.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0071_796113.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0077_796114.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0032_796115.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0038_212.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0079_796122.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0036_796127.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0039_796132.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0068_796135.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0069_796139.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0063_796141.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0081_426.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0003_1033.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0044_784.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0071_792.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0065_809.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0061_563.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0085_564.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0005_565.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0025_571.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0092_834.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0013_910.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0047_619.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0088_883.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0076_671.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0096_673.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0056_500.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0006_702.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0073_927.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0040_472.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0100_735.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0029_482.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0018_492.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0083_756.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0094_1013.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0038_1065.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0031_1066.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0043_1076.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0063_1101.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0070_796346.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0032_1149.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0045_1162.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0073_1171.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0074_1221.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0021_796339.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0064_796343.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0017_796349.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0075_796352.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0025_796361.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0072_796371.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0014_796373.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0040_796375.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0019_796391.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0022_796398.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0071_1559.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0105_1562.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0090_1567.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0019_1585.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0036_1604.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0007_1615.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0051_1650.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0015_1653.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0076_1661.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0002_1670.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0047_1706.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0077_1724.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0023_1485.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0004_1528.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0056_1493.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0058_1751.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0027_1754.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0055_1501.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0065_1502.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0006_1763.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0061_1510.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0032_1776.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0012_1784.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0061_794904.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0010_794907.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0029_1824.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0013_794914.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0047_794918.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0005_794922.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0032_794931.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0045_794940.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0001_794941.jpg"
  const imagePaths = imagePathsStr.split(',');
  const labels = imagePaths.map((imagePath, index) => `label_${index + 1}`);

  return (
      <Box>
          <Navbar/>
          <Stack direction="row" spacing={2} >
              <Sidebar/>
              <LassoChartL embeddings={embeddings} imagePaths={imagePaths}/>
          </Stack>
      </Box>
  );
}

export default Home;
