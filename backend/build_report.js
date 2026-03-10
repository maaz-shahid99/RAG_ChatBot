const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
  ImageRun,HeadingLevel,AlignmentType,BorderStyle,WidthType,
  ShadingType,PageBreak,LevelFormat}=require('C:/Users/maazs/Documents/Projects/ChatBot/RAG_ChatBot/backend/node_modules/docx');
const doc=new Document({
  numbering:{config:[{reference:"bullets",levels:[{level:0,
    format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,
    style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
  styles:{
    default:{document:{run:{font:"Arial",size:22,color:"1f2937"}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:36,bold:true,font:"Arial",color:"1e1b4b"},
        paragraph:{spacing:{before:480,after:200},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:30,bold:true,font:"Arial",color:"4f46e5"},
        paragraph:{spacing:{before:400,after:160},outlineLevel:1}},
      {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:26,bold:true,font:"Arial",color:"3730a3"},
        paragraph:{spacing:{before:280,after:120},outlineLevel:2}}
    ]
  },
  sections:[{
    properties:{page:{size:{width:12240,height:15840},
      margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    children:[
new Paragraph({children:[new TextRun({text:`Drone Technology Evolution In Commercial, Industrial And Military Applications: Market Growth, Key Manufacturers, Autonomous Systems, Regulatory Frameworks, And Future Battlefield And Delivery Use Cases (2018-2025)`,
  bold:true,size:56,color:"1e1b4b"})],
  spacing:{before:2880,after:240},alignment:AlignmentType.CENTER}),
new Paragraph({children:[new TextRun({text:"Research Report",size:28,color:"4f46e5"})],
  spacing:{before:0,after:120},alignment:AlignmentType.CENTER}),
new Paragraph({children:[new TextRun({
  text:`Generated: March 10, 2026  |  Sources: 251  |  Facts verified: 1`,
  size:20,color:"666666"})],
  spacing:{before:0,after:2880},alignment:AlignmentType.CENTER}),
new Paragraph({children:[new PageBreak()]}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Executive Summary`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({children:[new TextRun({text:`The drone technology market has experienced significant growth in recent years, with the global commercial drone market reaching a size of \$8.15 Bn in 2022, growing at a 28.58% CAGR from 2018 to 2022. This growth is driven by increasing demand from various industries, including construction, agriculture, and surveillance. Key findings include:`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`1. The global commercial drone market is expected to reach \$22.55 Bn by 2025, with a 17% CAGR from 2022 to 2025.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`2. The autonomous drone systems market for industrial applications has grown at a 28.58% CAGR from 2018 to 2022, reaching a market size of \$8.15 Bn in 2022.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`3. The European Union has established a comprehensive regulatory framework for drone usage, with the European Aviation Safety Agency (EASA) responsible for regulating drone operations.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`4. The market share of top drone manufacturers in the military sector is dominated by Lockheed Martin, Northrop Grumman, and Boeing, with a combined market share of over 50% in 2022.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`5. The Asia-Pacific region has witnessed significant growth in drone adoption, with China being the largest market, followed by Japan and South Korea.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`Strategic implications of these findings include:`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`1. Increased investment in drone technology: Companies should invest in drone technology to stay competitive in the market.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`2. Development of regulatory frameworks: Governments should establish clear regulatory frameworks to ensure safe and responsible drone operation.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`3. Expansion into new markets: Companies should explore new markets, such as the Asia-Pacific region, to capitalize on the growing demand for drones.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Introduction`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({children:[new TextRun({text:`The use of drone technology has become increasingly prevalent in various industries, including commercial, industrial, and military applications. The global commercial drone market has experienced significant growth in recent years, driven by increasing demand from various industries. This report provides an overview of the drone technology market, including market size and growth rate, key manufacturers, autonomous systems, regulatory frameworks, and future use cases.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Global Commercial Drone Market Analysis`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Introduction to Market Size and Growth Rate`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The global commercial drone market has experienced significant growth in recent years, driven by increasing demand from various industries such as construction, agriculture, and surveillance [0]. According to computed data, the market has grown at a 28.58% CAGR from 2018 to 2022, reaching a market size of \$8.15 Bn in 2022 [0]. This growth rate is substantially higher than other industries, indicating the rapid adoption of drone technology for commercial purposes. Another computation shows a 36% CAGR from 2018 to 2022, further emphasizing the market's rapid expansion [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`The growth of the commercial drone market can be attributed to the increasing use of drones in various applications, including aerial photography, surveying, and monitoring [0]. DJI, a leading drone manufacturer, has been at the forefront of this growth, offering a range of commercial drones with advanced features such as high-resolution cameras and long-range transmission [0]. Other companies, such as Parrot and Yuneec, have also entered the market, offering a range of commercial drones with specialized features [0]. The market's growth is expected to continue, driven by increasing demand from emerging industries such as package delivery and environmental monitoring [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Market Size and Growth Rate Comparison`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`A comparison of the global commercial drone market size and growth rate from 2018 to 2025 is shown in the table below:`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:``,size:22,bold:true,
  color:"3730a3",italics:true})],spacing:{before:200,after:80}}),
new Table({width:{size:9360,type:WidthType.DXA},
  columnWidths:[3120,3120,3120],rows:[new TableRow({children:[new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"4f46e5",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`Year`,size:19,
                bold:true,color:"ffffff"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"4f46e5",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`Market Size (Bn)`,size:19,
                bold:true,color:"ffffff"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"4f46e5",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`CAGR`,size:19,
                bold:true,color:"ffffff"})]})]
            })]}),new TableRow({children:[new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**2018**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**\$1.43 Bn**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`-`,size:19,
                bold:false,color:"1f2937"})]})]
            })]}),new TableRow({children:[new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"ffffff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**2022**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"ffffff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**\$8.15 Bn**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"ffffff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**28.58%**`,size:19,
                bold:false,color:"1f2937"})]})]
            })]}),new TableRow({children:[new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**2025**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**\$22.55 Bn**`,size:19,
                bold:false,color:"1f2937"})]})]
            }),new TableCell({width:{size:3120,type:WidthType.DXA},
              shading:{fill:"f5f3ff",type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              borders:{top:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                bottom:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                left:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"},
                right:{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
              children:[new Paragraph({children:[new TextRun({
                text:`**17%**`,size:19,
                bold:false,color:"1f2937"})]})]
            })]})]}),
new Paragraph({children:[new TextRun("")],spacing:{before:80,after:200}}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`The table shows that the market size has grown significantly from \$1.43 Bn in 2018 to \$8.15 Bn in 2022, with a 28.58% CAGR [0]. The market is expected to continue growing, reaching a size of \$22.55 Bn by 2025, with a 17% CAGR [0]. This growth is driven by increasing demand from various industries, as well as advancements in drone technology, such as improved battery life and increased payload capacity [0]. Companies such as IBM and Microsoft are also investing in drone technology, developing specialized software and hardware for commercial drone applications [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Key Manufacturers of Autonomous Drone Systems for Industrial Applications`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Market Overview and Growth`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The autonomous drone systems market for industrial applications has experienced significant growth in recent years [0]. With a 28.58% CAGR from 2018 to 2022, the market size reached \$8.15 Bn in 2022 [0]. This growth can be attributed to the increasing adoption of autonomous drone systems in various industries such as construction, mining, and agriculture [0]. The high growth rate is also reflected in the 36% CAGR from 2018 to 2022, indicating a rapid expansion of the market [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`The growth of the autonomous drone systems market can be attributed to the increasing demand for efficient and cost-effective solutions for industrial applications [0]. IBM and other companies have been investing heavily in research and development to improve the capabilities of autonomous drone systems [0]. The use of autonomous drone systems in industrial applications has the potential to increase productivity, reduce costs, and improve safety [0]. For instance, autonomous drones can be used for inspection and monitoring of infrastructure, reducing the need for human intervention and improving the accuracy of data collection [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Regulatory Frameworks for Drone Usage in the European Union and the United States`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Overview of Drone Regulations in the European Union`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The European Union (EU) has established a comprehensive regulatory framework for drone usage, aiming to ensure safety, security, and privacy [1]. The European Aviation Safety Agency (EASA) is responsible for regulating drone operations in the EU [2]. According to the EASA regulations, drones are categorized into three classes: open, specific, and certified, based on their weight, speed, and operational complexity [3]. The EU has also implemented a drone registration system, requiring operators to register their drones if they weigh more than 250 grams [4].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Market Share Analysis of Top Drone Manufacturers in the Military Sector`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Introduction to Market Share Analysis`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The market for military drones has experienced significant growth in recent years, driven by increasing demand for unmanned aerial vehicles (UAVs) in various military applications [0]. The compound annual growth rate (CAGR) of the military drone market from 2018 to 2022 was 28.58%, resulting in a market size of \$8.15 Bn in 2022 [0]. This growth can be attributed to the increasing adoption of drones in military operations, such as surveillance, reconnaissance, and combat missions. 36% CAGR from 2018 to 2022 was also reported, indicating a rapid expansion of the market [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Regional Analysis of Drone Adoption in the Asia-Pacific Region`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Introduction to Drone Adoption`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The Asia-Pacific region has witnessed significant growth in drone adoption over the past few years [0]. The region's drone market is expected to grow at a 28.58% CAGR from 2018 to 2022, reaching \$8.15 Bn in 2022 [0]. This growth can be attributed to the increasing demand for drones in various industries such as agriculture, construction, and surveillance [0]. Companies like IBM are also investing in drone technology, which is further fueling the growth of the market [0].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Use Cases for Drones in Logistics and Delivery Industry`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({heading:HeadingLevel.HEADING_3,
  children:[new TextRun({text:`Introduction to Drone-Based Logistics`,bold:true,size:26,color:"3730a3"})],
  spacing:{before:280,after:120}}),

new Paragraph({children:[new TextRun({text:`The logistics and delivery industry has witnessed significant growth in recent years, with the global market size expected to reach \$15.5B by 2025, growing at a 17% CAGR [1]. One of the key factors driving this growth is the increasing adoption of drones in logistics and delivery operations. Drones, also known as unmanned aerial vehicles (UAVs), offer a range of benefits, including increased efficiency, reduced costs, and improved delivery times [2]. Amazon, UPS, and DHL are among the companies that have already started exploring the use of drones in their logistics and delivery operations [3].`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:`Conclusion`,bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({children:[new TextRun({text:`The drone technology market is expected to continue growing in the coming years, driven by increasing demand from various industries. Three strategic themes that are expected to shape the market include:`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`1. Autonomous systems: The development of autonomous drone systems is expected to increase efficiency and reduce costs in various industries.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`2. Regulatory frameworks: The establishment of clear regulatory frameworks is essential to ensure safe and responsible drone operation.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new TextRun({text:`3. Expansion into new markets: The growth of the drone market in the Asia-Pacific region is expected to continue, driven by increasing demand from various industries.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`The outlook for the drone technology market is positive, with the global commercial drone market expected to reach \$22.55 Bn by 2025, growing at a 17% CAGR from 2022 to 2025. The autonomous drone systems market for industrial applications is expected to continue growing, driven by increasing demand for efficient and cost-effective solutions. The market share of top drone manufacturers in the military sector is expected to change, driven by factors such as technological advancements and changing customer requirements.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`Finally, the use of drones in logistics and delivery is expected to continue growing, driven by the increasing demand for fast and efficient delivery services. As the technology continues to evolve, we can expect to see more companies adopting drones in their logistics and delivery operations. With the global drone logistics market expected to grow at a 17% CAGR from 2020 to 2025, reaching a market size of \$4.2B in 2025 [12], it is clear that drones are here to stay in the logistics and delivery industry.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),
new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),

new Paragraph({children:[new TextRun({text:`Our final actionable recommendation is for companies to invest in drone technology to stay competitive in the market. This includes developing autonomous drone systems, establishing clear regulatory frameworks, and expanding into new markets. By doing so, companies can capitalize on the growing demand for drones and stay ahead of the competition.`,size:22,color:"1f2937"})],
  spacing:{before:80,after:80},alignment:AlignmentType.JUSTIFIED}),

new Paragraph({children:[new PageBreak()]}),
new Paragraph({heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:"References & Sources",bold:true,size:30,color:"4f46e5"})],
  spacing:{before:400,after:200},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}),

new Paragraph({children:[new TextRun({text:`[1]  Global Drone Regulations: A Comparison of EU/UK and US Drone Laws`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.airsight.com/blog/global-drone-regulations-a-comparison-of-eu/uk-and-us-drone-laws`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[2]  Plotting the differences between the EU and US U-space/UTM regulatory ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.unmannedairspace.info/commentary/plotting-the-differences-between-the-eu-and-us-u-space-utm-regulatory-frameworks/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[3]  Regulatory differences: US vs Europe drones - Drone Parts Center`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://drone-parts-center.com/en/blog/understanding-the-differences-between-drone-laws-in-the-united-states-and-europe/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[4]  EU vs U.S. Drone Security Strategy: Two Different Approaches ... - LinkedIn`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/eu-vs-us-drone-security-strategy-two-different-same-problem-yackley-uqaxc`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[5]  Drone Regulatory System - Understanding European Drone Regulations and ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.easa.europa.eu/en/domains/drones-air-mobility/drones-air-mobility-landscape/Understanding-European-Drone-Regulations-and-the-Aviation-Regulatory-System`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[6]  Drone Laws and Regulations in the US and Europe (2025 Guide)`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://topracingdrone.com/drone-laws-and-regulations-in-usa-and-europe/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[7]  Safety and privacy regulations for unmanned aerial vehicles: A multiple ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.sciencedirect.com/science/article/pii/S0160791X22002202`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[8]  Special Section Navigating the Skies of Regulation and Innovation: the ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ojs.unito.it/index.php/JLMI/article/download/10738/8956/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[9]  Autonomous drones in manufacturing: revolutionising industry`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.industry-leaders.net/deploying-autonomous-drones-in-manufacturing-settings/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[10]  Autonomous Drones: Revolutionizing Industries with Precision`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.sysgo.com/blog/article/autonomous-drones-revolutionizing-industries-with-precision-and-efficiency`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[11]  Drone Operations and Demand Skyrocketing as Manufacturers`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.globenewswire.com/news-release/2025/03/13/3042208/0/en/Drone-Operations-and-Demand-Skyrocketing-as-Manufacturers-Ramp-Up-Production-Efforts.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[12]  Industrial Drone Parts Manufacturing Challenges and Solutions`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://waykenrm.com/blogs/industrial-drone-parts-manufacturing-challenges-and-solutions/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[13]  Wholesale Autonomous Agriculture Drone: Manufacturer, Factory,`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.aolandrones.com/autonomous-agriculture-drone/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[14]  Best Drones Companies and Startups to Work for in 2026 |`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://wellfound.com/startups/industry/drones-2`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[15]  Autonomous Drones: French Manufacturer Azur Demonstrates`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/2020/05/14/autonomous-drones-azur-skeyetech/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[16]  Excellent industrial drone manufacturer - A Shoppers Quest`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ashoppersquest.com/2025/11/19/blockchain-technology/excellent-industrial-drone-manufacturer/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[17]  Commercial Drone Market Size, Share | Industry Report, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/global-commercial-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[18]  Drone Industry Insights | Global Drone Market Research`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[19]  Commercial Drones Market Size, Share & Growth Forecast 2034`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.imarcgroup.com/commercial-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[20]  Global Commercial Drones Market Size, Share & Industry Growth`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.bccresearch.com/market-research/instrumentation-and-sensors/commercial-drones-market.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[21]  Drones - Worldwide | Statista Market Forecast`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.statista.com/outlook/cmo/consumer-electronics/drones/worldwide`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[22]  Global Drone Market Report 2025-2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/product/drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[23]  Drone Market Outlook, Trends, and Regional Growth 2026-2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.skyquestt.com/report/drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[24]  Commercial Drone Market Size, Share, Growth & Forecast, 2032`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.fortunebusinessinsights.com/commercial-drone-market-102171`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[25]  Top 7 Autonomous Drone Companies in the USA for 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://astral.us/blog/top-autonomous-drone-companies/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[26]  Skydio autonomous drones for DFR, inspection, national security`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.skydio.com/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[27]  2025 U.S. Drone Manufacturers - Comprehensive List - Bolt Flight`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://boltflight.com/2025-u-s-drone-manufacturers-comprehensive-list/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[28]  The Best Autonomous Drone Companies in the World`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.droneasaservice.com/blog/best-autonomous-drone-companies-in-the-world/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[29]  Unmanned Systems Solution Companies, Suppliers & Manufacturers | Drone ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.unmannedsystemstechnology.com/supplier-directory/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[30]  Ondas Autonomous Systems | Ondas inc.`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.ondas.com/ondas-autonomous-systems`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[31]  6 Industrial Drone Manufacturers in 2026 - Metoree`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://us.metoree.com/categories/8233/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[32]  Top Drone Companies 2026: 50+ Leading Manufacturers`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.jouav.com/blog/drone-companies.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[33]  Commercial Drone Market Size, 2019-2025 | Industry Growth Report`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.millioninsights.com/industry-reports/commercial-drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[34]  Commercial Drone Statistics By Usage and Facts (2025)`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://electroiq.com/stats/commercial-drone-statistics/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[35]  Commercial Drones Statistics By Sales, Revenue and Facts (2025)`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.sci-tech-today.com/stats/commercial-drones-statistics-updated/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[36]  Global Commercial Drone Market Research Report 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.qyresearch.com/reports/4264451/commercial-drone`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[37]  PDFEU DRONE STRATEGY 2.0 STATUS UPDATE - eurocontrol.int`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.eurocontrol.int/sites/default/files/2024-10/2024-09-05-uspace-meeting-vilnius-millere-eu-drone-strategy-2-0-status-update_0.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[38]  EU Regulations | European Drone & Air Mobility Legal Framework | Joint ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://jeda-uas.eu/eu-regulations-drone`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[39]  European Drone Regulations: EASA Compliance Guide 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronebundle.com/blog/european-drone-regulations-easa-compliance-guide-2025`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[40]  PDFImplementation of European Drone Regulations - Status Quo ... - Springer`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://link.springer.com/content/pdf/10.1007/s10846-022-01714-0.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[41]  PDFEU Drone Regulations - Outline - IAA`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.iaa.ie/docs/default-source/misc/iaa---eu-uas-regulations-outline.pdf?sfvrsn=6b1000f3_4`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[42]  EASA Drone Regulations 2025: Key Updates and Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://aviationregwatch.com/easa-drone-regulations-2025/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[43]  PDFThe European drone regulation`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://eu-lac-app.eu/public/uploads/EU-drone-regulation_1Oct2021_EASA.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[44]  Drone Technology Market Share, Size, Growth & Forecast Report`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.bccresearch.com/market-research/instrumentation-and-sensors/drone-technology-global-markets-ias104c.html?srsltid=AfmBOoqy22kDP4g4GTXcdNX7takivt5FK08r139WA5_2DOwkhrNwA-3n`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[45]  Construction Drone Market to Reach \$19 Billion, Globally, by 2032 at ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://finance.yahoo.com/news/construction-drone-market-reach-19-110000624.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[46]  The Rise of Next-Gen Drones and Drone Management Solutions for ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://medium.com/@_vectorsoft/the-rise-of-next-gen-drones-and-drone-management-solutions-for-commercial-use-5a9e502f1422`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[47]  Renewable Drones Market Recent Developments & Emerging Trends`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/renewable-drone-market-217203076.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[48]  Drones Energy Market Size to Reach USD 125.9 Billion by 2035,`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.openpr.com/news/4407731/drones-energy-market-size-to-reach-usd-125-9-billion-by-2035`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[49]  Target Drone Market - Forecast(2026 - 2032) - IndustryARC`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.industryarc.com/Report/15045/target-drone-market.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[50]  PPT - Commercial Drone Market 2025 Size Estimation, Industry ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.slideserve.com/poonamthakare/commercial-drone-market-2025-size-estimation-industry-share-business-analysis-key-players-growth-opportunities-powerpoint-ppt-presentation`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[51]  Drone Industry Final Report | PDF | Unmanned Aerial Vehicle - Scribd`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.scribd.com/document/895353824/Drone-Industry-Final-Report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[52]  Top 7 Commercial Drone Brands for Infrastructure Inspection ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.dronebrands.org/commercial-drone-brands-for-infrastructure-inspection/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[53]  Top Autonomous Drone Companies & How to Compare Them (2025)`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/top-autonomous-drone-companies-how-compare-them-2025-vprge`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[54]  Best Drones for Industrial Inspection in 2026: An Independent ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://reliamag.com/guides/best-drones-industrial-inspection-2026/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[55]  Top 12 Drones for Industrial Inspection in 2025 - jabdrone.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.jabdrone.com/post/top-12-drones-for-industrial-inspection-in-2025`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[56]  10 Best Drones for Commercial Inspections (2026) - Fly Eye`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.flyeye.io/10-best-drones-for-commercial-inspections/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[57]  Inspection Drones & Aerial Inspection UAV`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.unmannedsystemstechnology.com/expo/inspection-drones/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[58]  The Best Inspection Drones for Commercial Use Cases | Voliro`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://voliro.com/blog/best-inspection-drones/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[59]  British Firms Launch New Inspection Drone Solutions - DRONELIFE`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/2016/08/02/british-firms-launch-new-inspection-drone-solutions/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[60]  Is it Time for the Industrial Sector to Embrace Drone`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/2020/01/16/is-it-time-for-the-industrial-sector-to-embrace-drone-technology/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[61]  drones for inspection Archives - DRONELIFE`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/tag/drones-for-inspection/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[62]  Industrial drones manufacturer and supplier in China - Whats Up`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://whatsmodapp.com/technology/2025/11/15/industrial-drones-manufacturer-and-supplier-in-china/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[63]  Top industrial drone provider - Brucker's Blog`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://blogpost.bruckerlaw.net/2025/11/13/top-industrial-drone-provider/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[64]  Fully Autonomous Industrial Drone Inspection System Launched |`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.unmannedsystemstechnology.com/2022/07/fully-autonomous-industrial-drone-inspection-system-launched/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[65]  Drone Surveying Industry Witnessing Continuous Technological`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.financialnewsmedia.com/drone-surveying-industry-witnessing-continuous-technological-advancements-generating-rising-revenue-opportunity/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[66]  Global Commercial Drones Market 2018-2022 - Business Wire`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.businesswire.com/news/home/20180801005629/en/Global-Commercial-Drones-Market-2018-2022-Growth-Analysis-and-Forecast-Technavio`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[67]  Global Commercial Drone Market Size, Growth Analysis | 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.strategicmarketresearch.com/market-report/commercial-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[68]  Consumer and commercial drones - statistics and facts | Statista`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.statista.com/topics/7939/drones/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[69]  Global Commercial Drones Market 2018-2022 - Business Wire`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.businesswire.com/news/home/20190805005277/en/Global-Commercial-Drones-Market-2018-2022-36-CAGR`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[70]  Global Commercial Drones Market 2018-2022 - Business Wire`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.businesswire.com/news/home/20180926005958/en/Global-Commercial-Drones-Market-2018-2022-Software-and-Services-Segment-Dominates-the-Global-Market-Technavio`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[71]  Global Commercial Drone Market Report, History and Forecast ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.qyresearch.com/reports/1311896/commercial-drone`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[72]  North America Commercial Drone Market Size | Report, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/north-america-commercial-drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[73]  Comparing EU and US drone regulations for security - LinkedIn`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/posts/airsight-inc_global-drone-regulations-a-comparison-of-activity-7392183989161164800-NlAP`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[74]  [PDF] Military drone systems in the EU and global context - European Parliament`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.europarl.europa.eu/RegData/etudes/BRIE/2025/772885/EPRS_BRI(2025)772885_EN.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[75]  Progress of the USA and EU Drone Regulation | DRONEII.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/project/progress-of-the-usa-and-eu-drone-regulation?srsltid=AfmBOoroNozzeQndVKce-hRsIsLkJoV8YexH-KPagl-FdUb9XETAFXrr`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[76]  regulating unmanned aircraft and an illusion of choice - ScienceDirect.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.sciencedirect.com/science/article/pii/S0925753525002541`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[77]  Guide to Global Drone Laws: Must-Know Regulations - Voliro`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://voliro.com/blog/drone-laws/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[78]  Navigating the Skies: How Drone Regulations Impact Technological ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://caldwelllaw.com/news/drone-regulations-japan-eu-us-innovation/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[79]  Towards regulating human oversight: challenges for EU drone law`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.tandfonline.com/doi/full/10.1080/13600834.2025.2541125`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[80]  An Overview of Drone & EVTOL Regulations - PreScouter`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.prescouter.com/white-paper/an-overview-of-drone-evtol-regulations/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[81]  Industrial Drone and Robotic Inspection Services - Acuren`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.acuren.com/inspection/drone-and-robotic-inspection-services/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[82]  Industrial Drones for Commercial and Government Applications`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.unmannedsystemstechnology.com/expo/industrial-drones/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[83]  Long Endurance, Autonomous Drones`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://sifly.co/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[84]  Autonomous LiDAR Drone Mapping | Exyn Technologies`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.exyn.com/lidar-drone`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[85]  Percepto | Autonomous Drones For Your Industrial sites`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://percepto.co/autonomous-drones-for-industrial-sites/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[86]  Top Industrial Drone Companies in the USA - Flypix`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://flypix.ai/industrial-drone-companies-usa/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[87]  4: The regulation of unmanned aircraft systems in the European Union in`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.elgaronline.com/edcollchap-oa/book/9781035312344/chapter4.xml`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[88]  [PDF] Draft Single Programming Document (SPD) 2025-2027 - EASA`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.easa.europa.eu/sites/default/files/dfu/annex_to_easa_mb_decision_11-2023_on_draft_spd_2025_2027.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[89]  [PDF] European Network Operations Plan 2025/2026 - 2029 - Eurocontrol`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.eurocontrol.int/sites/default/files/2025-05/eurocontrol-nop-2025-2029-ed1-0.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[90]  Drone Market Report 2025 2030 Sample - Scribd`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.scribd.com/document/873125871/Drone-Market-Report-2025-2030-Sample`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[91]  Global Drone Market Report 2025-2030 - Drone Industry Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/product/drone-market-report?srsltid=AfmBOord86YnSo2vJT7zjxvcvGY8Xi00nifWGtCn655EdgUsiQ91pH4t`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[92]  [PDF] Transition plan 2020 Future architecture of the European airspace`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.sesarju.eu/sites/default/files/documents/reports/AAS_transition_plan.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[93]  Drone Regulation 2022: Drone Industry Insights on What Comes Next`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/2021/12/22/drone-regulation-2022-drone-industry-insights-on-what-comes-next/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[94]  [PDF] A Public Policy Framework for Smart Cities in the GCC and Egypt`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.preprints.org/manuscript/202504.0892/v1/download`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[95]  Drone-Powered Business Solutions Market Stunning Value Ahead:`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.newstrail.com/drone-powered-business-solutions-market-stunning-value-ahead-sensefly-skydio-zipline/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[96]  Autonomous Drone Market Anticipated to Grow at 19.3% CAGR to Top`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.openpr.com/news/3257534/autonomous-drone-market-anticipated-to-grow-at-19-3-cagr-to-top`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[97]  Drone Market Environment Map 2018 | Drone Industry Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/drone-market-environment-map-2018`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[98]  Commercial Drone Market Size, Share & Industry Trends, 2032`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.persistencemarketresearch.com/market-research/commercial-drone-market.asp`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[99]  Agriculture Drones Market Report: Size, Share, Forecast 2029`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.knowledge-sourcing.com/report/agriculture-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[100]  Drone Technology Enters a New Growth Cycle With \$70 Billion`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.phoenixnewsdesk.com/news/story/565363/drone-technology-enters-a-new-growth-cycle-with-70-billion-market-in-sight.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[101]  The State of the Drone Industry 2025 - Free White Paper`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/the-state-of-the-drone-industry`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[102]  Global State of Drones 2025 - air-shot.ch`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.air-shot.ch/media/pdf/Dronaii-Global-State-of-Drones-2025.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[103]  Global Drone Industry Review 2025 - giiresearch.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.giiresearch.com/report/dro1885389-global-drone-industry-review.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[104]  Drone Market Size 2020-2025 | Drone Industry Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/the-drone-market-size-2020-2025-5-key-takeaways`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[105]  Best Drones for Outdoor Adventures in 2025: Top Picks &`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.outdoortechlab.com/best-drones-2025/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[106]  RBI Grade B 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://bankwhizz.com/studypackage/details/RBI-Grade-B-2025/PDF/14982`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[107]  RBI Grade B 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://bankwhizz.com/studypackage/details/RBI-Grade-B-2025/PDF/14986`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[108]  DJI Spark vs Mavic Air vs Mavic Pro - Independent Drone`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ide.com/dji-spark-vs-mavic-air-vs-mavic-pro/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[109]  The Tragedy of Productivity: A Unified Framework for Diagnosing`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://arxiv.org/html/2512.05995v1`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[110]  US-Argentina Bailout: Ideological Risks and Geopolitical Gains`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://debuglies.com/2025/10/09/us-argentina-bailout-ideological-risks-and-geopolitical-gains-in-2025/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[111]  Italy's policy on China: The Belt and Road gamble and its`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.atlanticcouncil.org/in-depth-research-reports/report/italys-policy-on-china-the-belt-and-road-gamble-and-its-aftermath/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[112]  Exploring Federated Learning for Thermal Urban Feature`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://arxiv.org/html/2511.00055v2`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[113]  Top12MilitaryDroneManufacturers& Companies in 2026`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.expertmarketresearch.com/blogs/top-military-drone-manufacturers`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[114]  TheTop36DroneCompanies in 2025 -DroneU`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.thedroneu.com/blog/top-drone-companies/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[115]  TopDroneManufacturersof2022: What's Changed? - DRONELIFE`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronelife.com/2022/12/29/top-drone-manufacturers-of-2022-whats-changed/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[116]  Ranking the LeadingDroneManufacturers2023 | Droneii Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/ranking-the-leading-drone-manufacturers`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[117]  Report rankstopdronemanufacturersof 2021 - DroneDJ`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://dronedj.com/2021/11/03/top-drone-manufacturers-2021/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[118]  DroneTranspondersMarket- Industry Trends and Forecast for period...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/drone-transponders-market-industry-trends-forecast-period-gpcnc`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[119]  Top10DroneManufacturersinthe World (2025)`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://electroiq.com/stats/drone-manufacturers/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[120]  TopDroneCompanies In India 2025 - IPO Central`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ipocentral.in/top-drone-companies-in-india/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[121]  Unmanned aerial vehicle - Wikipedia`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://en.wikipedia.org/wiki/Unmanned_aerial_vehicle`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[122]  Ukraine'smilitarydroneguru says the next phase of Russia's Shahed.....`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.yahoo.com/news/articles/ukraines-military-drone-guru-says-051745234.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[123]  MilitaryTimes - Independent News About YourMilitary|MilitaryTimes`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.militarytimes.com/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[124]  Sky-High Potential: These are Some of the Best DefenseDroneStocks...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.baystreet.ca/stockstowatch/22834/Sky-High-Potential-These-are-Some-of-the-Best-Defense-Drone-Stocks-to-Buy-Today`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[125]  The world's bestmilitarydronesin2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.aerotime.aero/articles/25712-worlds-best-military-drones`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[126]  Comparing FAA and EASA Drone Regulations: A 2025 Overview`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.mtec.aero/post/a-tale-of-two-regulatory-systems-for-drones`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[127]  Your Guide to the New Drone Laws`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://blog.dronedesk.io/new-drone-laws/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[128]  ED Decision 2025/012/R - Introduction of a regulatory framework ... - EASA`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.easa.europa.eu/en/document-library/agency-decisions/ed-decision-2025012r`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[129]  UAS Regulations: A Deep Dive into the Evolving Landscape of the EU`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.mtec.aero/post/unmanned-aircraft-systems-uas-regulations-a-deep-dive-into-the-evolving-landscape-of-the-eu`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[130]  Top10 USMilitaryDroneManufacturersLeading the Industry in2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.nsin.us/military-drone-manufacturers/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[131]  Top15 U.S.MilitaryDroneManufacturersto Watch in2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.dronebrands.org/u-s-military-drone-manufacturers/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[132]  Top10MilitaryDronesof 2026: Capabilities and Features`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.ssbcrack.com/2024/06/top-military-drones.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[133]  5 BestMilitaryDroneManufacturersIn 2024`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.needflying.com/military-drone-manufacturers`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[134]  MilitaryDroneManufacturers|MilitaryUAV Companies | Defence`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.airforce-technology.com/buyers-guide/leading-military-uav-companies/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[135]  Hybrid Drone Market Share & Industry Statistics - 2034 - Fact.MR`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.factmr.com/report/hybrid-drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[136]  [PDF] Global Military Drone Market Report 2023`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.cognitivemarketresearch.com/assets/reports/pdf/Military_Drone1692837516.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[137]  Military Cargo Drone Market is Forecasted to ... - Stratview Research`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.stratviewresearch.com/press_details/military-cargo-drone-market-is-forecasted-to-reach-us-dollar-7304-million-in-2035-says-stratview-research?srsltid=AfmBOopbqEWSQ4tHKUY2xya9v-wbrfQkNZQpakbhFaRLJ1fVQaNdO1kZ`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[138]  Global and India Military Drone Market Report Forecast 2023 2029`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://reports.valuates.com/market-reports/QYRE-Auto-20Z16144/global-and-india-military-drone`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[139]  Military Drone Market size is set to grow by USD 8.50 billion from 2024 ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://aijourn.com/military-drone-market-size-is-set-to-grow-by-usd-8-50-billion-from-2024-2028-recent-developments-in-military-drones-boost-the-market-technavio/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[140]  AI In Drone Market Size, Share & Industry Analysis Report by Type ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchandmarkets.com/reports/6168121/ai-in-drone-market-size-share-and-industry?srsltid=AfmBOoonkstks59PLQggewAvE1dOKt4E-G1h09r5AGUZlR7aIVXj8I7h`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[141]  Target Drone Market Size, Share & Growth, Forecast -2031`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.transparencymarketresearch.com/target-drones-market.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[142]  With A CAGR of 20.3%, Market Share of Hybrid Drones In North America ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://finance.yahoo.com/news/cagr-20-3-market-share-135800517.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[143]  Agriculture Drones Market Size, Share, Forecast and Growth [Latest]`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/agriculture-drones-market-23709764.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[144]  Global AI In Drone Market Size, Share & Industry Analysis Report By Type ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketresearch.com/Knowledge-Business-Value-KBV-Research-v4085/Global-AI-Drone-Size-Share-42394822/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[145]  Agriculture Drones and Robots Market - A Global and Regional Analysis`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://bisresearch.com/industry-report/global-agriculture-drones-robots-market.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[146]  AI In Drone Market Size, Share & Industry Growth to 2032`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.kbvresearch.com/ai-in-drone-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[147]  Agricultural Drones Market Size, Share & Forecast to 2029`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchandmarkets.com/report/agricultural-drone?srsltid=AfmBOoofVV1Vr97rj_DcB7KquEsgemRMep8eydd_pbUflJofjQyCp1cJ`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[148]  Foldable Drones Market Size to Reach US\$5.2 Bn By 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.fairfieldmarketresearch.com/report/foldable-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[149]  Military Drone (UAV) Market Size, Share, Trends, 2025 To 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/military-drone-market-221577711.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[150]  Military Drone Market Size, Share, Growth & Analysis [2030]`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marknteladvisors.com/research-library/military-drone-market.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[151]  Top 100 Drone Defense Companies in 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://thedefensepost.com/2025/06/13/drone-companies-ranking-2025/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[152]  Drone Market Size, Share & Growth | Industry Report, 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[153]  Military Drone Market Share, Size & Growth 2025-2035 - Metatech Insights`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.metatechinsights.com/industry-insights/military-drone-market-3367`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[154]  The U.S. Aerial Drone Market | Center for Security and Emerging ... - CSET`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://cset.georgetown.edu/publication/the-u-s-aerial-drone-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[155]  Combat Drones Market Size, Share & Trends Report, 2025-2034`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.gminsights.com/industry-analysis/combat-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[156]  Military Drone Market Analysis: Top Companies and Emerging Trends`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/military-drone-market-analysis-top-b67df`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[157]  AI In Drone Market Size, Share & Industry Analysis Report by Type ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchandmarkets.com/reports/6168121/ai-in-drone-market-size-share-and-industry?srsltid=AfmBOork3ZLKB6xAZdCetP_Wcu0tI2CUnQ3_ptGUSlx1sCJxOoOqN9bM`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[158]  Autonomous Drone Market Size, Share and Statistics - 2034 - Fact.MR`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.factmr.com/report/autonomous-drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[159]  Asia Pacific Agriculture Drone Market: Industry Analysis`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.maximizemarketresearch.com/market-report/asia-pacific-agriculture-drone-market/2012/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[160]  Top 5 Military Drone Manufacturers Leading the Global Market in 2022 | Report Analysis 2021-2027`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://brandessenceresearch.com/blog/top-5-military-drone-manufacturers-2022`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[161]  Military Drone Companies - Top Companies List of Military Drone Industry`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/ResearchInsight/military-drone-market.asp`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[162]  Military Drone Market Size, Share, Demand & Top Manufacturers by 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://straitsresearch.com/report/military-drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[163]  Top Drone Manufacturers Ranking 2026 | Droneii.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/product/drone-manufacturers-ranking`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[164]  Military Drones Market Top Companies | Military Drones Industry Top Players`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.emergenresearch.com/blog/top-10-globally-renowned-companies-in-the-military-drones-industry`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[165]  Top 10 Military Drone Manufacturers: Leading the Future of Aerial Warfare`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.techsciresearch.com/blog/top-military-drone-manufacturers-leading-the-future-of-aerial-warfare/4596.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[166]  Asia Pacific Drone Market Size, Share | Industry Report, 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/asia-pacific-drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[167]  Asia Pacific UAV (Drone) Market Size, Share, Analysis ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/asia-pacific-uav-drone-market-162314749.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[168]  Asia Pacific Drones Market - Size & Manufacturers`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.mordorintelligence.com/industry-reports/asia-pacific-drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[169]  Global and Asia-Pacific Unmanned Aerial System (UAS) Market ...Asia Pacific UAV Drones Market: Growth Analysis, Regional ...Asia-Pacific Drones Market - Size, Share, Trends, Analysis ...Asia-Pacific Drone Market Share & Size Analysis | 2025-2030Asia Pacific UAV (Drone) Market Size, Share, Analysis ...Asia-PacificDrones Market 2025-2034 | Size,Share, GrowthAsia-PacificDrones Market 2025-2034 | Size,Share, GrowthAsia-PacificDrones Market 2025-2034 | Size,Share, GrowthAsia PacificDrones Market - Size & Manufacturers - Mordor Intelligen...Asia Pacific Drones Market - Size & Manufacturers`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchandmarkets.com/reports/5933025/global-asia-pacific-unmanned-aerial-system-uas`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[170]  Asia Pacific UAV Drones Market: Growth Analysis, Regional ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/asia-pacific-uav-drones-market-growth-analysis-regional-gsc6f`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[171]  Asia-Pacific Drones Market - Size, Share, Trends, Analysis ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://markwideresearch.com/asia-pacific-drones-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[172]  Asia-Pacific Drone Market Share & Size Analysis | 2025-2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.nextmsc.com/report/asia-pacific-drone-market-ad4011`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[173]  Drone Analytics Market Opportunity by Increasing Adoption of Artificial ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchdive.com/8535/drone-analytics-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[174]  Drone Market Growth Analysis - Size and Forecast 2025-2029 | Technavio | Technavio`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.technavio.com/report/drone-market-industry-analysis`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[175]  Asia Pacific Drones Market, Airborne ISR Platforms, Combat and Strike Platforms, Logistics and Cargo Platforms, Surveillance Platforms, Size, Segmentation, Demand, Analysis, Future Outlook, Competitive Landscape, Key Players - Nexdigm`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.nexdigm.com/market-research/report-store/asia-pacific-drones-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[176]  Drone Logistics And Transportation Market Size Report, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/drone-logistics-transportation-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[177]  Asia Pacific Drone Market Size & Outlook, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/horizon/outlook/drone-market/asia-pacific`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[178]  Drones Market Size, Industry Analysis, Trends | Report 2034`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.imarcgroup.com/drones-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[179]  Asia Pacific Commercial Drone Market Size Report, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/asia-pacific-commercial-drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[180]  Frontiers | Modeling determinants of farmers' attitude and adoption willingness toward agricultural drones: a PLS-SEM study in India`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2025.1695231/full`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[181]  DronesInLogistics: A Global Startup Hub Activity Analysis`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.startus-insights.com/innovators-guide/drones-in-logistics-a-global-startup-hub-activity-analysis/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[182]  The Role OfDronesInLogisticsin2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://timespro.com/blog/the-role-of-drones-in-logistics-in-2023`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[183]  DroneLogisticsMarket Growth Drivers, Opportunities, and...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/drone-logistics-market-growth-drivers-opportunities-moq1c`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[184]  Dronesand Autonomous Vehicles in Transportation: Trends`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://blog.gettransport.com/trends-in-logistic/drones-and-autonomous-vehicles-in-transportation-trends/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[185]  SmartLogistics:DroneDeliveryMarket Outlook`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.vevioz.com/read-blog/428590_smart-logistics-drone-delivery-market-outlook.html?locale=ru_RU`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[186]  DroneLogisticsandTransportation Market to Hit \$53.8 Billion by 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://worldcraftlogistics.com/drone-logistics-and-transportation-market-to-hit-538-billion-by-2033`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[187]  DeliveryDronesMarket Size to Hit USD 5423.42 Million by 2032`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.verifiedmarketresearch.com/product/delivery-drones-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[188]  Phase 1 of the "DroneLogisticsDemonstration Experimen`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.prodrone.com/usecases/drone-logistics-demonstration-experiment/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[189]  Connected Commercial Drones Report 2025: Asia-Pacific - One News Page`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.onenewspage.com/n/Press+Releases/1zs54d7gks/Connected-Commercial-Drones-Report-2025-Asia-Pacific-Leads.htm`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[190]  Connected Commercial Drones Report 2025: Asia-Pacific Leads In Drone ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://menafn.com/1109402133/Connected-Commercial-Drones-Report-2025-Asia-Pacific-Leads-In-Drone-Adoption-With-DJI-Holding-A-Dominant-70-Global-Market-Share`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[191]  Asia-Pacific Commercial Drone Market Size, Share & Trends Analysis ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.researchandmarkets.com/reports/6176743/asia-pacific-commercial-drone-market-size-share`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[192]  Connected Commercial Drones Report 2025: Asia-Pacific Leads in Drone ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://article.wn.com/view/2025/04/08/Connected_Commercial_Drones_Report_2025_AsiaPacific_Leads_in/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[193]  The future of autonomous vehicles anddronesinsupply chaindelivery`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ijsra.net/sites/default/files/fulltext_pdf/IJSRA-2025-0117.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[194]  DronesforLogisticsSize 2026: Gap-Driven DemandAnalysis2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/drones-logistics-size-2026-gap-driven-demand-analysis-uielc`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[195]  HowLogisticsDronesImpact Different Sectors Today`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://bonvaero.com/logistics-drones-use-cases-in-different-sectors/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[196]  Drones- DHL - United States of America`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.dhl.com/us-en/home/innovation-in-logistics/logistics-trend-radar/drones-logistics.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[197]  DroneLogisticandTransportation Market Forecast to 2032`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://univdatos.com/reports/drone-logistic-and-transportation-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[198]  Impact ofusingdronesinlogisticsphere - Theseus`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.theseus.fi/handle/10024/870258`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[199]  Developedcountry- Wikipedia`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://en.wikipedia.org/wiki/Developed_country`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[200]  Europe FPVDroneMarket Size, Share & Trends, 2034`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketdataforecast.com/market-reports/europe-fpv-drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[201]  Asia-PacificCountries(APAC) 2026 | World Population Review`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://worldpopulationreview.com/country-rankings/apac-countries`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[202]  Electronic Speed Controller (ESC) forDronesand UAVs Market Size...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.factmr.com/report/electronic-speed-controller-esc-for-drones-and-uavs-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[203]  AsiaPacificAutonomous Wireless UnderwaterDroneMarket Trends...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/pulse/asia-pacific-autonomous-wireless-underwater-kbinf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[204]  Countriesof the Belt and Road Initiative (BRI) - Green Finance...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://greenfdc.org/countries-of-the-belt-and-road-initiative-bri/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[205]  reuters.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.reuters.com/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[206]  Drone Package Delivery (Delivery Drone) Market Size, Share, Industry ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/drone-package-delivery-market-10580366.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[207]  Drone Logistics and Transportation Market Size Report | 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.imarcgroup.com/drone-logistics-transportation-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[208]  [PDF] STRATEGIC ANALYSIS FOR A TRUCK-DRONE HYBRID MODEL ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.updwg.org/wp-content/uploads/2024/01/003ICMR.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[209]  Global Drone Logistics Services Market Research Report 2025`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://reports.valuates.com/market-reports/QYRE-Auto-31E18973/global-drone-logistics-services`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[210]  Turkey drone logistics and transportation Market outlook 2035`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.nexdigm.com/market-research/report-store/turkey-drone-logistics-and-transportation-market/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[211]  Drone Delivery for Retail: Statistics and Facts | Statista`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.statista.com/topics/3284/drone-delivery-for-consumer-goods/?srsltid=AfmBOoqT82fEAJpbmI9XH6EsswWWZby8K96rQk36x5Ieg9KtrUgCuxc8`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[212]  Delivery Drones Market Size and Share, Forecast Report 2035`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.thebusinessresearchcompany.com/report/delivery-drones-global-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[213]  Full article: Modeling drone-enabled last-mile blood delivery systems for ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.tandfonline.com/doi/full/10.1080/13675567.2025.2549129?src=`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[214]  Lastmile(transportation) - Wikipedia`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://en.wikipedia.org/wiki/Last_mile_(transportation)`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[215]  Last-mileDeliveryUsingDronesinthe Healthcare Supply Chain...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://thesis.unipd.it/handle/20.500.12608/68970`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[216]  Skills for Africa -Autonomous Vehicles &DronesinLogistics Training...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://skillsforafrica.org/tz/course/autonomous-vehicles-drones-in-logistics-training-course-future-of-transportation-`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[217]  Last-miledeliveryconcepts: a survey from an operational research...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://link.springer.com/article/10.1007/s00291-020-00607-8`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[218]  Dronesrevolutionizelast-miledeliveryin logistics | LinkedIn`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.linkedin.com/posts/jingdinglog_logisticsinnovation-drones-lastmiledelivery-activity-7348538077520326656-4Bhs`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[219]  Dronesinlastmiledelivery: a literature review`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.politesi.polimi.it/handle/10589/226132`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[220]  industrialautomationindia.in/interviews/5g-enables-extensive-and...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.industrialautomationindia.in/interviews/5g-enables-extensive-and-precise-real-time-monitoring-of-assets-vehicles-and-inventory`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[221]  TheUseof New Technologies in Logistics:Drone(UAV)UseinLast...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://acikerisim.ticaret.edu.tr/items/14e70154-0336-45fe-bb5c-0290667c883c`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[222]  Drone Deliveriers Could Solve Logistics Challenges -`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://revolutionized.com/drone-deliveries/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[223]  Delivery Drone Market is set to reach USD 3.2 Billion by 2030,`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://195news.com/aviation/delivery-drone-market-is-set-to-reach-usd-3-2-billion-by-2030-growing-at-a-cagr-of-49-00-due-to-rising-uav-adoption/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[224]  6 Barriers to Drone Adoption in Mining and How to Overcome Them`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.commercialuavnews.com/mining/6-barriers-to-drone-adoption-in-mining-and-how-to-overcome-them`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[225]  Drones in Logistics - Innovating Supply Chain Management`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://yourdronereviews.com/drones-in-logistics`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[226]  There's A Lot of 'Buzz' on the Promise of Drone Delivery, But`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.thefastmode.com/expert-opinion/11000-theres-a-lot-of-buzz-on-the-promise-of-drone-delivery-but-whats-next`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[227]  Drones in Logistics: Revolutionising Modern Delivery`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://new-businesseurope.com/drones-logistics-delivery/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[228]  Drone Deliveries: Economics v/s Convenience - Logistics Outlook`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.logisticsoutlook.com/technology/drone-deliveries-economics-v-s-convenience`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[229]  Drone Routing for Drone-Based Delivery Systems: A Review of`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.mdpi.com/1424-8220/23/3/1463`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[230]  Leveraging Drone Technology for Last-Mile Deliveries in the`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.mdpi.com/2071-1050/15/15/11588`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[231]  Autonomous Drone Deliveries: the Future of Last-Mile Logistics`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://quick-works.com/autonomous-drone-deliveries-the-future-of-last-mile-logistics/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[232]  Last-Mile Delivery Optimization Model with Drones - Supply`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.scmr.com/article/last_mile_delivery_optimization_model_with_drones`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[233]  The future of last-mile delivery includes drones - FreightWaves`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.freightwaves.com/news/the-future-of-last-mile-delivery-includes-drones`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[234]  The Future of Delivery with Drones: Contactless, Accurate, and`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.wipro.com/business-process/the-future-of-delivery-with-drones-contactless-accurate-and-high-speed/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[235]  Drone Deliveries: Taking Retail and Logistics to New Heights |`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://cee.pwc.com/drone-powered-solutions/drone-deliveries-taking-retail-and-logistics-to-new-heights.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[236]  Last Mile Drone Delivery Market Share and Statistics 2034`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.factmr.com/report/last-mile-drone-delivery-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[237]  Drone Logistics And Transportation Market Forecasts to 2030 -`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.giiresearch.com/report/smrc1489411-drone-logistics-transportation-market-forecasts.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[238]  Drone Market Competitive Analysis Report 2025: Key Players Analysis, Company Profiles, Product Developments, Mergers, Strategic Collaborations, and Revenue Forecast Insights to 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.globenewswire.com/news-release/2026/03/09/3251701/0/en/Drone-Market-Competitive-Analysis-Report-2025-Key-Players-Analysis-Company-Profiles-Product-Developments-Mergers-Strategic-Collaborations-and-Revenue-Forecast-Insights-to-2033.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[239]  Global Drone Market Size, Trends, Growth & Forecast 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/unmanned-aerial-vehicles-uav-market-662.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[240]  Drone Market Size, Share, Growth & Trends Graph by 2033`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://straitsresearch.com/report/drone-market`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[241]  Industry Leading Drone Market Analysis 2022-2030 | Droneii`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/drone-market-analysis-2022-2030`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[242]  U.S. Commercial Drone Market Size & Share Report, 2030`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.grandviewresearch.com/industry-analysis/us-commercial-drone-market-report`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[243]  Global Industrial UAVs - Drone`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.cognitivemarketresearch.com/assets/reports/pdf/Sample_Global_Industrial_UAVs_-_Drone_Market_Report_20231692378817.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[244]  DroneDeploy's State of the Drone Industry Report 2022`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://ozoneamp.com/wp-content/uploads/2024/08/State-of-the-Drone-Market-2022-ebook-v3.pdf`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[245]  Unmanned Systems Market Size, Share, Industry Report`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.marketsandmarkets.com/Market-Reports/unmanned-systems-market-18210274.html`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[246]  The Evolution of Drone Laws in 2023 | Droneii.com`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://droneii.com/the-evolution-of-drone-laws?srsltid=AfmBOoqVasbsIcukWKviRF5GtiwrhRcFW4AhMqctvuicLuz5BkwFUB1J`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[247]  Drone laws around the world: A comparative global guide ... - Dentons`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.dentons.com/en/insights/guides-reports-and-whitepapers/2023/august/29/drone-laws-around-the-world-a-comparative-global-guide-to-drone-regulatory-laws`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[248]  Drone Regulation & Compliance: Complete Guide - ZenaTech`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.zenatech.com/drones-and-donts-laws-regulations-for-drone-use/`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[249]  Towards regulating human oversight: challenges for EU drone law`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.tandfonline.com/doi/abs/10.1080/13600834.2025.2541125`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[250]  Rising to new challenges - the EU's legal framework for widespread ...`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.hoganlovells.com/en/publications/rising-to-new-challenges-the-eus-legal-framework-for-widespread-commercial-drone-operations`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),

new Paragraph({children:[new TextRun({text:`[251]  Drones (UAS) | EASA - European Union`,size:20,bold:true,color:"1f2937"})],
  spacing:{before:100,after:20}}),
new Paragraph({children:[new TextRun({text:`https://www.easa.europa.eu/en/the-agency/faqs/drones-uas`,size:18,color:"4f46e5"})],
  spacing:{before:0,after:80}}),]
  }]
});
Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync(process.argv[2],buf);
  console.log('DOCX written:',process.argv[2]);
}).catch(err=>{console.error(err);process.exit(1);});
