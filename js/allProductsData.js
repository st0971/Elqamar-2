// js/allProductsData.js

// 將 allProductsData 賦值給 window 物件，使其成為全域可用的變數
window.allProductsData = [
    // 首頁
    {
        id: 1,
        name: '表情集',
        price: 9999,
        img: 'images/人+表情.jpg',
        description: '<p>項目包含：<br>表情如無指定將隨機繪製</br><br>如有設定為左圖組合（左）</br><br>如無設定為右圖組合（右）</br><img src="images/設定集.jpg"><img src="images/直版.jpg">',
    },
    {
        id: 2,
        name: '大頭',
        price: 9999,
        img: 'images/大頭.jpg',        
    },
   {
        id: 3,
        name: '全身',
        price: 9999,
        img: 'images/全身.jpg',
        description: '<p>項目包含：<br>表情如無指定將隨機繪製</br><img src="images/排版.jpg"><img src="images/排版-2.jpg">',
    },
    // ... 可以根據需要添加更多預購商品

    // 半身
    {
        id: 101, // 使用不同的 ID 範圍，避免與 indexData 衝突
        name: '大頭',
        price: 9999,
        img: 'images/大頭.jpg',
        stock: 10
    },
    // {
    //     id: 105,
    //     name: '第五人格魔幻魅影',
    //     price: 60,
    //     img: 'images/第五魔幻拍立得.png',
    //     description: '選款：可\n商品：偽拍立得\n出品方：分子互動(淘寶)\n材質：紙\n尺寸：約86*108mm\n隱藏款：無',
    //     stock: 10
    // },
    // ... 可以根據需要添加更多分類商品
    // 全身
    {
        id: 201,
        name: '表情集',
        price: 9999,
        img: 'images/人+表情.jpg',
        description: '<p>項目包含：<br>表情如無指定將隨機繪製</br><br>如有設定為左圖組合（左）</br><br>如無設定為右圖組合（右）</br><img src="images/設定集.jpg"><img src="images/直版.jpg">',
    },
    {
        id: 202,
        name: '全身',
        price: 9999,
        img: 'images/全身.jpg',
        description: '<p>項目包含：<br>表情如無指定將隨機繪製</br><img src="images/排版.jpg"><img src="images/排版-2.jpg">',
    },
    // 例圖 
    {
        id: 901, // 使用不同的 ID 範圍，避免與 indexData 衝突
        // name: '名偵探柯南消失的手錶',
        // price: 300,
        img: 'images/元一.jpg',
        // description: '商品：消失的手錶（小隱藏）',
        // stock: 1
    },
    {
        id: 902, // 使用不同的 ID 範圍，避免與 indexData 衝突
        // name: '第五人格六周年禮盒',
        // price: 200,
        img: 'images/芋泥寶寶.jpg',
        // description: '商品：第五人格六周年禮盒（谷美）',
        // stock: 1
    },
    {
        id: 903, // 使用不同的 ID 範圍，避免與 indexData 衝突
        // name: '名偵探柯南零系列徽章',
        price: 160,
        img: 'images/emotions.jpg',
        // description: '商品：zero系列雙閃徽章',
        // stock: 1
    },
    // ... 可以根據需要添加更多分類商品
];
// console.log(allProductsData); // 這行現在可有可無，因為已經掛載到 window 上