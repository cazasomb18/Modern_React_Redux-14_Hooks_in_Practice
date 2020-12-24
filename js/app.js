////////////////////////////////////////////////////////////////////////////////////////////////////
//Hooks in Practice

//Project Overview
	//We are going to rebuild the 'videos' youtube api app w/ hooks instead of classBased components:

							//App
	//SearchBar				//VideoList			VideoDetail
							//VideoItem
		//remember, VideoList, VideoDetail and VideoItem are all function comps, w/ no state
			//--> we do not have to change these components in any ways

		//App --> useState and useEffect hooks
		//SearchBar --> useState hook
			//--> 2 files we'll update


 ////////////////////////////////////////////////////////////////////////////////////////////////////
 //Refactoring the SearchBar Component
 	//we are using state --> probably need to use the useState hook
 		//no lifecycle methods --> we do NOT need the useEffect hook

 	//1 - Import use state in react import statement
 	//2 - create function SearchBar = () => {} and initialize state w/ hook:
 		const SearchBar = () => {
			const [term, setTerm] = useState('');	
		};
 		//we're going to go through this line by line in order to change it to a function component
 	//3 - Move onInputChange = () => {} and onFormSubmit = () => {} to new function, add const prefix
 		//We aren't finished there b/c these make use of the class-based 'this' syntax:
 		const SearchBar = () => {
			const [term, setTerm] = useState('');
			const onInputChange = (e) => {
				setTerm(e.target.value);
			};
			const onSubmit = (e) => {
				e.preventDefault();	
				onTermSubmit(term);
			};
		};
	//4 - in render(){} ==> move return statement to new function comp, now we'll go through line by line
	//and change the syntax to reflect function component and remove remaining parts of old class:
		const SearchBar = ({ onFormSubmit }) => {
			const [term, setTerm] = useState('');

			const onSubmit = (e) => {
				e.preventDefault();
				
				onFormSubmit(term);
			};

			return (
				<div className="search-bar ui segment">
					<form 
						onSubmit={onSubmit} 
						className="ui form"
					>
						<div className="field">
							<label>VIDEO SEARCH</label>
							<input 
								type="text" 
								value={term}
								onChange={(e) => setTerm(e.target.value)}
							/>
						</div>
					</form>
				</div>
			);
		};

		//onInputChange is short so let's apply it inline:
			<input 
				type="text" 
				value={term}
				onChange={(e) => setTerm(e.target.value)}
			/>



////////////////////////////////////////////////////////////////////////////////////////////////////
//Refactoring the App
	//GOAL: replace class-based syntax and use hooks to make component work identically in a function
	//component

		//Since we have 2 piece of state here we'll need the use the useState hook twice

		//Since we're using CDM ==> we'll need to use useEffect hook

		//1 - import useState / useEffect and set state w/ videos / selectedVideo:
			const App = () => {
				const [videos, setSelectedVideo] = useState([]);
				const [selectedVideo, setSelectedVideo] = useState(null);
			};

		//2 - call useEffect w/ [] as 2nd arg (since it runs ONLY ONCE), and move over CDM logic under useEffect:
			const App = () => {
				const [videos, setVideos] = useState([]);
				const [selectedVideo, setSelectedVideo] = useState(null);

				useEffect = (() => {
					onTermSubmit('buildings');
				}, []);
				
				onTermSubmit = async term => {
					const response = await youtube.get('/search', {
						params: {
							q: term
						}
					});

					setVideos(response.data.items);
					setSelectedVideo(response.data.items[0]);
				};
			};

			//3 - now move onVideSelect to new App function:
				onVideoSelect = video => {
					setSelectedVideo(video);
					
				};

			//4 - move return statement to bottom of app function, and refactor to exlucde 'this':
				const App = () => {
					const [videos, setSelectedVideos] = useState([]);
					const [selectedVideo, setSelectedVideo] = useState(null);

					useEffect(() => {
						onTermSubmit('buildings');
					}, []);

					const onTermSubmit = async term => {
						const response = await youtube.get('/search', {
							params: {
								q: term
							}
						});
						//DON'T FORGET TO DEFINE THESE FUNCTIONS W/ 'const'!!!

						setSelectedVideos(response.data.items);
						setSelectedVideo(response.data.items[0]);
					};

					const onVideoSelect = video => {
						setSelectedVideo(video);
						
					};

					return (
						<div className="ui container">
							<SearchBar onFormSubmit={onTermSubmit}/>
							<div className="ui grid">
								<div className="ui row">
									<div className="eleven wide column">
										<VideoDetail video={selectedVideo}/>
									</div>
									<div className="five wide column">
										<VideoList onVideoSelect={onVideoSelect} videos={videos}/>	
									</div>
								</div>
							</div>
						</div>
					);
				};
				//@ this point we have made this a function based application, howver, none of the code
				//is any more legible or reusable, it will require more work.





////////////////////////////////////////////////////////////////////////////////////////////////////
//Removing a Callback
	//onVideo select only has one line, so we can probably provide this function inline
		//makes it a little easier to read/understand

		//1 - replace onVideoSelect={onVideoSelect} w:
			<VideoList 
				onVideoSelect={(video)=> setSelectedVideo(video)} 
				videos={videos}
			/>
			//now remove the onVideoSelect declaration

		//2 - whenver we have this: 
			onVideoSelect={(video)=> setSelectedVideo(video)}
				//we can replace it with:
				onVideoSelect={setSelectedVideo}
			//*** notice ^^^ this ^^^ pattern ^^^^ ***
				//receiving some list of arguments, in this case one
					//providing this list of arguments to the setSelectedVideo function
						//whenver we see this pattern, have an arg and pass it directly in 



////////////////////////////////////////////////////////////////////////////////////////////////////
//Overview for Custom Hooks
	//Maybe at some point we want to create an analytics comp 
		//imagine we're working on a much larger app, like youtube.com
			//whenever we want to reuse some code we should be able to that code into a new component
				//we can then use this component in both the App and Analytics Component

		//GOAL: create custom hook with some video fetching logic inside of it

		//CUSTOM HOOKS:
			//Best way to create reusable code in a React project (besides components!)
				//we use custom hooks anytime we want to make some calls to useState/useEffect more reusable
			//Created by extracting hook-related code out of a function component
				//we're talking about the logic specifically, NOT any JSX
			//Custom hooks ALWAYS make use of at least one primitive hook internally
				/*useState, useEffect, etc. --> we're taking some existing code and putting it into a reusable
				function*/
			//Each custom hook should have one purpose
				//in this case: fetching videos ONLY wouldn't work if it has more than one function...
			//Kind of an art form!
				//unfortunately - it's very challenging, there are not fool-proof ways to go about it
			//Data-fetching is a great thing to try to make reusable!



////////////////////////////////////////////////////////////////////////////////////////////////////
//Process for Building Custom Hooks

	//Identify each line of code related to some single purpose
		//we're looking at components and trying to identify code that has a singular purpose
		//App Component > 2 major goals (managing 2 pieces of state):
			//List of Videos
			//SelectedVideo

	//Identify the inputs to that code
		//What are the arguments to that code? 
			//In this case we have one, the search term

	//Identify the outputs to that code
		//What do we take FROM the response and make use of in the JSX?
			//2 outputs:
				//Video array itself
				//onTermSubmit() function

	/*Extract all of the code into a separate function, receiving the inputs as arguments, and returning
	the outputs*/

	//Think of inputs/outputs like this:
		//If you give me a: 
			//DEFAULT SEARCH TERM
		//I will give you:
			//A WAY TO SEARCH FOR VIDEOS
			//A LIST OF VIDEOS



////////////////////////////////////////////////////////////////////////////////////////////////////
//Extracting Video Logic
	//GOALS: 
		//1 - App comp to be able to call the useVideos function
		//2 - Provide to it list of inputs (default term)
		//3 - Return default outputs (list of videos and function that can be used to serach for vids)
		//4 - Import useVideos into App.js and call from body of App

	//1 - create dir in src hooks, and create useVideos.js in there, import useState & useEffect & youtube:
		//name: useVideos is a convention, follow camelCase syntax for hooks, good practice for pros
	//2 - Move state for videos and setVideos, as well as useEffect to useVideo.js:
		//2.b - move setSelectedVideo from App.js to useVideos.js:
		//2.c - Move onTermSubmit from App and move to hook useVideos:
			//we may want to be able to set this up so that 'buildings' isn't the default search term. So...
		//2.d - Add this as an arg to useVideos and call onTermSubmit w/ it:
			const useVideos = (defaultSearchTerm) => {
				const [videos, setVideos] = useState([]);

				useEffect(() => {
					onTermSubmit(defaultSearchTerm);
				}, []);
			};
			//inputs are now provided

	//3 - Now we need to return tyhe outputs, we can do this in 2 ways:
		//1: return outputs inside an array: return [videos, onTermSubmit]
			//REACT CONVENTION
		//2: can do a more common JS syntax w/ object: return { videos, onTermSubmit }
			//JAVASCRIPT CONVENTION
				/* *** one last change: replace all onTermSubmit calls/declarations w/ search 
				to make it more semantic*** */

		//WITH THIS WE HAVE COMPLETED OUR CUSTOM HOOK



////////////////////////////////////////////////////////////////////////////////////////////////////
//Using the Custom Hook
	//Let's import useVideos into App.js and remove youtube import:
		import useVideos from '../hooks/useVideos';

	//Now we'll call that custom hook as if it's any other sort of hook, passing in default search term:
		const [videos, search] = useVideos('buildings');
		//whenever use submits search term will call search(), will receive term and update videos state
			//this takes care of onFormSubmit(){}, now we'll work on selectedVideo

	//Call useEffect(() => {}), inside 2nd arg: we'll run setSelectedVideo w/ first video in that list:
		useEffect(() => {
			setSelectedVideo(videos[0]);
		}, [videos]);

	//Now let's take care of the warning message in the console: "React Hook useEffect has a missing 
	//dependency: 'defaultSearchTerm'."
		//Whenever we make use of some outside inside of useEffect, react wants us to include that
		//inside the arrow function:



////////////////////////////////////////////////////////////////////////////////////////////////////
//Another Use of Custom Hooks - coding exercise 10:
	//GOAL: get some sort of post variable into the App component

	//2 files, app.js usePost.js
		//usepost ---> custom hook, fetches posts from API and returns them
	//Import that hook into App.js and make use of it inside the App

	/*You will use custom hooks written by other engineers quite frequently, so it is important to 
	understand and use them without much documentation.

	In this exercise, a hook called usePost has been written for you.  This hook will retrieve a list
	of posts from an API:

	Goals: 
		1. Import and use the usePosts hook to fetch a list of posts in the App component

	Hints:
		1. Don't forget to import the usePosts hook at the top of App.js
		2. Remember to take a look at the type of data that is returned from the hook. It is probably 
		an array of objects.
		3. Rendering logic has already been written for you, so you shouldn't need to modify any of the JSX*/

//App.js:
import React, { useState, useEffect } from 'react';
import usePosts from './usePosts';

export default function App() {
    // Add in code here to use the 'usePosts' hook.
    const [posts, setPosts] = usePosts({posts});

    useEffect(() => {
    	setPosts(posts);
    }, [{posts}]);


    
    const renderedPosts = posts.map((post) => {
        return <li key={post.id}>{post.title}</li>;
    });
    
    return (
        <div>
            <h3>Posts</h3>
            <ul>{renderedPosts}</ul>
        </div>
    );
};

//usePosts.js
import React from 'react';
const { useState, useEffect } = React;

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      "mode": "cors",
      "credentials": "omit"
    }).then(res => res.json())
    .then(data => setPosts(data))

  }, []);//[] ==> runs every time app is rerendered

  return posts;
};

export default usePosts;
//////YOU COULDN'T FIGURE THIS OUT////
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Exercise Solution:
	//look at usePosts.js:
		//declaring a piece of state called posts, w/ setter, and code to make an api request
			//we're then using the data returned from api to update a piece of state called posts

	//Now in App.js we'll import usePosts, call it and see if it gives us an array of objects:


	import React, { useState, useEffect } from 'react';
	import usePosts from './usePosts';

	export default function App() {
	    // Add in code here to use the 'usePosts' hook.

	    const posts = usePosts();
	    //that's it, this is the solution... fuck you...

	    const renderedPosts = posts.map((post) => {
	        return <li key={post.id}>{post.title}</li>;
	    });
	    
	    return (
	        <div>
	            <h3>Posts</h3>
	            <ul>{renderedPosts}</ul>
	        </div>
	    );
	};
	//REMEMBER THE WHOLE POINT OF CUSTOM HOOKS IS TO MAKE REUSABLE COMPONENTS, YOU WERE OVERTHINKING IT!!!