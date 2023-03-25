import './App.css';
import React, { useState, useEffect } from 'react';
import './App.css';

//to use algilia (easy to use than HackerNewsAPI)

function App() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState('loading...');
  useEffect(() => {
    async function fetchNewsStories () {
      try {
        //二種類の記述あり
        // １
        // const data = await(await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page')).json();
        // setStories(data.hits)
        // const message = data.hits.length ? '' : 'No stories found';
        // setMessage(message);

        //2
        // await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page')
        // .then((response) => response.json()) 
        // .then(data => {
        //   console.log(data)
        // setStories(data.hits)
        // const message = data.hits.length ? '' : 'No stories found';
        // setMessage(message);})

        //🌟公式のAPI使う！ 
        await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then((response) => response.json()) 
        .then(newsData => {
          const topTenIds = newsData.slice(0, 10); //sliceで取得するデータの範囲を指定できる
          const promises = topTenIds.map((newsID) => (
            fetch(`https://hacker-news.firebaseio.com/v0/item/${newsID}.json?print=pretty)`)
            .then(response => response.json())
            ))
          return Promise.all(promises); //全部の情報が揃ってから出力する
        })
      .then(data => {
        console.log(data)
        setStories(data)
        const message = data.length ? '' : 'No stories found';
        setMessage(message);
      });

        //   console.log(data)
        // setStories(data.hits)
        // const message = data.hits.length ? '' : 'No stories found';
        // setMessage(message);})


        // https://hacker-news.firebaseio.com/v0/topstories.json
        //fetchは非同期処理。通常、動作を待たずJSは処理を続けてしまう＝async&awaitの出番。fetchを使う時はuseEffectが必要。
        //await後の(記述)が終わったら、以下が発動

      } catch (err) {
        console.log(`err: ${err.mesasge}`, err);
        setMessage('could not fetch stories');
      }
    }
    fetchNewsStories()
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Latest HN Stories</h2>
        {message}
        <div className="stories">
          {Array.isArray(stories) && stories.map(
            (story) => (story.url && <h3><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a> - by {story.author}</h3>
            // story => story.url && <h3><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a> - by {story.author}</h3>
//()でstoryを囲っても囲わなくてもOK
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
