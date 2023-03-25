import './App.css';
import React, { useState, useEffect } from 'react';
import './App.css';

//to use algilia (easy to use than HackerNewsAPI)

function App() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState('loading...');
  useEffect(() => {
    async function fetchNewsStories () { //非同期処理  try/catch/awaitで構成される。
      try {
        const data = await (await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page')).json();
        // await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page')
        // .then((response) => response.json()) 
        // // responseをjsonデータにする
        // const data = response
        console.log(data)
        //fetchは非同期処理。通常、動作を待たずJSは処理を続けてしまう＝async&awaitの出番。fetchを使う時はuseEffectが必要。
        //await後の(記述)が終わったら、以下が発動
        setStories(data.hits)
        const message = data.hits.length ? '' : 'No stories found';
        setMessage(message);
      } catch (err) {
        console.log(`err: ${err.mesasge}`, err);
        setMessage('could not fetch stories');
      }
    }//async functionの記述
    fetchNewsStories()//記述したfunctionの発火
  }, []);//一度だけuseEffectが発動

  return (
    <div className="App">
      <header className="App-header">
        <h2>Latest HN Stories</h2>
        {message}
        <div className="stories">
          {Array.isArray(stories) && stories.map(  //storiesが配列か確認、配列の場合map関数起動
            (story) => (story.url && <h3><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a> - by {story.author}</h3>
            //storiesを各要素毎にstoryに割り当て、story.urlが存在したら、<h3>のように各要素を割り当てる
            // story => story.url && <h3><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a> - by {story.author}</h3>
//()でstoryを囲っても囲わなくてもOK
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
