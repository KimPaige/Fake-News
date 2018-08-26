 
Millennials do not have the time or inclination to read traditional news articles. But what if they could engage with the news quickly and effortlessly on a fun platform that fits straight into their everyday lives? Enter...

# *Fake* News

Fake News curates the latest and most outrageous comments posted on Stuff.co.nz news articles, and uses machine learning technology to understand the tone of what commenters are saying. Using this knowledge, Fake News summarises the current state of the nation, and effectively communicates this via fun phrases and colour-coordination every time the user opens a new tab. Once the user's attention is captured, they are free to browse the most significant comment of the day from each emotion; joy, sadness, fear, anger and disgust.

## How to get started


### Prerequisites
 - Fake News utilises IBM Cloud's Watson API for machine learning. Head to [IBM Cloud Services](https://www.ibm.com/cloud/) to make a free account. Create an instance of their Tone Analyzer service running on their 'United States South' server. 
 - Your system will need Node Package Manager installed .

### Running Fake News on your local machine
 - Clone this repository onto your local machine.
 - In the top level directory create the text file titled ".username" which contains your username for the Tone Analyzer service you just created.
 -  In the top level directory create the text file titled ".password" which contains your password for the Tone Analyzer service you just created.
 - Open a terminal window to the "backend" directory.
 - Run `npm install`.
 - Run `npm start`. 
 - Open your browser to [http://localhost:5000/](http://localhost:5000/)   and enjoy!
 
 ![Command Line Install Animation](https://github.com/KimPaige/Fake-News/blob/master/images/terminal.gif)
 
 
 ## Thanks
 
 This project is the result of 16 hours work by four student developers and one designer at the 2018 Summer of Tech Create Camp. We would like to give thanks to all involved, without your generous investments of time and mentorship this project would not have been possible. Special thanks to Flux Federation for hosting the weekend-long event and to our awesome mentor, Michael from Xero!

 
 ## Screenshots
 
  ![Landing page with overall state of the nation (joy)](https://github.com/KimPaige/Fake-News/blob/master/images/1.png)
  
  ![Most sad comment](https://github.com/KimPaige/Fake-News/blob/master/images/2.png)
   
  ![Most disgusted comment](https://github.com/KimPaige/Fake-News/blob/master/images/3.png)
    
  ![Most fearful comment](https://github.com/KimPaige/Fake-News/blob/master/images/4.png)
     
  ![Most angry comment](https://github.com/KimPaige/Fake-News/blob/master/images/5.png)
      
  ![Most joyful comment](https://github.com/KimPaige/Fake-News/blob/master/images/6.png)
