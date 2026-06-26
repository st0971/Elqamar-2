// js/allProductsData.js

// 將 allProductsData 賦值給 window 物件，使其成為全域可用的變數
window.allProductsData = [
    // 來自 indexData 的商品 (預購商品)
    {
        id: 1,
        name: '人+表情集',
        price: 9999,
        img: 'images/人+表情.jpg',
        description: '<p>項目包含：<br>表情如無指定將隨機繪製</br><br>如有設定會幫忙製作設定集</br><img src="images/橫版有說明.jpg">',
    },
    {
        id: 2,
        name: '大頭',
        price: 9999,
        img: 'images/大頭.jpg',        
    },
    // {
    //     id: 3,
    //     name: '家庭教師晨間準備',
    //     price: 1800,
    //     img: 'images/家教晨起掛件.jpg',
    //     description: '選款：可\n商品：馬口鐵徽章\n出品方：1010(日網)\n材質：壓克力/鐵\n尺寸：約H68×W68×D3mm\n隱藏款：無'
    // },
    // ... 可以根據需要添加更多預購商品

    // 來自 第五人格 的商品 
    {
        id: 101, // 使用不同的 ID 範圍，避免與 indexData 衝突
        name: '大頭',
        price: 9999,
        img: 'images/大頭.jpg',
        stock: 10
    },
    // {
    //     id: 102,
    //     name: '第五人格魔幻魅影',
    //     price: 730,
    //     img: 'images/第五魔幻特殊徽章.png',
    //     description: '選款：不可，單抽95$\n商品：馬口鐵徽章盲盒—特別版\n出品方：分子互動(淘寶)\n材質：馬口鐵\n尺寸：約50*80mm\n隱藏款：有',
    //     stock: 10
    // },
    // {
    //     id: 103,
    //     name: '第五人格魔幻魅影',
    //     price: 95,
    //     img: 'images/第五魔幻掛件.png',
    //     description: '選款：可\n商品：壓克力掛件\n出品方：分子互動(淘寶)\n材質：壓克力\n尺寸：約72*50mm\n隱藏款：無',
    //     stock: 10
    // },
    // {
    //     id: 104,
    //     name: '第五人格魔幻魅影',
    //     price: 580,
    //     img: 'images/第五魔幻透卡.png',
    //     description: '選款：不可，單抽75$\n商品：透卡盲盒\n出品方：分子互動(淘寶)\n材質：PET\n尺寸：約100*140mm\n隱藏款：無',
    //     stock: 10
    // },
    // {
    //     id: 105,
    //     name: '第五人格魔幻魅影',
    //     price: 60,
    //     img: 'images/第五魔幻拍立得.png',
    //     description: '選款：可\n商品：偽拍立得\n出品方：分子互動(淘寶)\n材質：紙\n尺寸：約86*108mm\n隱藏款：無',
    //     stock: 10
    // },
    // ... 可以根據需要添加更多分類商品
    // 來自 現貨 的商品 
    {
        id: 901, // 使用不同的 ID 範圍，避免與 indexData 衝突
        name: '名偵探柯南消失的手錶',
        price: 300,
        img: 'images/消失的手錶_小隱_2.png',
        description: '商品：消失的手錶（小隱藏）',
        stock: 1
    },
    {
        id: 902, // 使用不同的 ID 範圍，避免與 indexData 衝突
        name: '第五人格六周年禮盒',
        price: 200,
        img: 'images/真理谷美_2.png',
        description: '商品：第五人格六周年禮盒（谷美）',
        stock: 1
    },
    {
        id: 903, // 使用不同的 ID 範圍，避免與 indexData 衝突
        name: '名偵探柯南零系列徽章',
        price: 160,
        img: 'images/零系列徽章_2.png',
        description: '商品：zero系列雙閃徽章',
        stock: 1
    },
    // ... 可以根據需要添加更多分類商品
];
// console.log(allProductsData); // 這行現在可有可無，因為已經掛載到 window 上