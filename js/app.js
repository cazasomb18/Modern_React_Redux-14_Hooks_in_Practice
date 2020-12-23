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

			//5 - 