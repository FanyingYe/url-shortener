## 短网址生成器

### 设计思路
工作原理：当用户输入一个长URL，通过应用散列算法计算出对应的短URL，并将它们存储到数据库以供日后查询。一旦有人访问短URL，服务器会在数据库中进行查询取得原始长URL并重定向到它。

在base62.js文件中采用除余算法来生成5位短链接，例如 goog.le/JQt0g

采用长度为62，只包含字母和数字(26+26+10)的字符映射表，charSet="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

算法：生成一个在62^4 - 62^5范围内的随机数，将此随机数除以62，用余数查找字符，用商继续迭代运算。比如，随机数为67，那么67 / 62 = 1 余 5， 则短链接添加字符 charSet[1]=“1” 和字符 charset[5]=“6”，得到16

### 数据库Schema
简介   | 参数|  类型 
---    | --- | --- 
短链接 | ShortUrl| String 		
长链接 | OriginalUrl | String

### API接口
简介   | URL | 方法 | 参数 |  例子
---    | --- | --- | --- | ---
主页   | /   |  GET|
生成一个短链接 | /u/ | POST | 	|将返回生成的短链接
访问短链接 | /:ShortUrl | GET |  | 将返回301并跳转		

### 运行与测试
先安装依赖包
```sh
npm install
```
然后运行
```sh
node app.js
```
打开浏览器,输入地址测试
```sh
localhost:3000
```

