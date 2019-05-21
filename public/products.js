'use strict';


class ProductList extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            faces: [],
            page: 1,
            loading: false,
            sorting: false,
            prevY: 0,
            sort: ""
        } 
    }

componentDidMount() {
    this.getfaces(this.state.page) 
    
    //options
    let options = {
        root: null, //Page as root
        rootMargin: '0px',
        threshold: 1.0
    };

    //Create an observer
    this.observer = new IntersectionObserver(
        this.handleObserver.bind(this), //callback
        options
    );

    //observe the 'loadingRef'
    this.observer.observe(this.loadingRef);


}

handleObserver( entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
        const nextPage = this.state.page + 1
        const currentPage = nextPage;
        this.getfaces(currentPage);
        this.setState({ page: currentPage })
    }
    this.setState({ prevY: y });
}


    
    getfaces =  async (page) => {
        this.setState({ loading: true })
        const response = await axios.get("http://localhost:3000/products?",{
             params: {
                 _sort: this.state.sort,
                 _page: page,
                 _limit: 15
             }
         })
        
            this.setState({faces: [...this.state.faces, ...response.data]})
            this.setState({ loading: false })
            this.setState({ sorting: false })
        }

    //converts the time to relative time
    displayRelativeTime = (previous) => {

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    
    //finds the difference between the current time and the time the emoji was created
    const timeDifference = new Date().getTime() - new Date(previous).getTime();

    
    if (timeDifference < minute) 
         return Math.round(timeDifference/1000) + ' seconds ago';   
    
    else if (timeDifference < hour) 
         return Math.round(timeDifference/minute) + ' minutes ago';   

    else if (timeDifference < day ) 
         return Math.round(timeDifference/hour ) + ' hours ago';   
    
    else if (timeDifference < month) 
        return Math.round(timeDifference/day) + ' days ago';   

    else if (timeDifference < year) 
        return Math.round(timeDifference/month) + ' months ago';   

    else 
        return Math.round(timeDifference/year ) + ' years ago';   
    
}

    setSortHandler = (e) => {
        this.setState({ faces: [] })
        this.setState({ sorting: true })
        this.setState({ sort: e.target.value })
    }


    // Helper function to render adverts
    renderAdverts = () => {
        const randomNumber = Math.floor(Math.random() * 1000)
        {this.state.faces.length > 0 && 
            this.state.faces.length % 20 === 0 ? 
            <img className="ad" src={`/ads/?r=${randomNumber} + `}/> :
            null
            }
        
    };
      
    // Helper function to render faces
    renderContent = () => {
        console.log(this.state.faces)
       return this.state.faces.map(face => {
            return (
                <div 
                    key={face.id} 
                    className="card"
                >
                <div className="card__items">{face.face}</div>
                <div className="card__details">
                    <p>{`Size: ${face.size}px`}</p>  {/*add pixels to the size*/}
                    <p>{`Price: $${(face.price/100).toFixed(2)}`}</p>  {/*formats the price to 2 decimal places*/}
                    <p>{`Date: ${this.displayRelativeTime(face.date)}`}</p>
                </div>
                </div>
            )
        })
        
    }
    render() {
        const randomNumber = Math.floor(Math.random() * 1000)
        const loadingfaces = { display: this.state.loading ? "block" : "none"}
        return(
            <div className="container">
                <div className="options">
                    <span>Sort according to Prize, Date or Size</span>
                    <select className="field" onChange={this.setSortHandler} value={this.state.sort}>
                        <option value="" disabled hidden>Choose here</option>
                        <option>size</option>
                        <option>price</option>
                        <option>date</option>
                    </select>
                    {/* <button onClick={this.getfaces}>Sort</button> */}
                </div>
                {this.state.sorting ? <div className={loadingfaces}>sorting</div> :
                    <div className="cards">
                        {this.renderContent()}
                    </div>
                }
                    {/*Condition insert an advert when the number of item on the screen
                    is a factor of 20 */}
                    {this.state.faces.length % 20 === 0 ?
                    <img className="ads" src={`/ads/?r=${randomNumber} + `}/> :
                    null}

                    {/*Loadingref is a reference point that signals to the observer fuction that
                    we have gotten to the end of the screen*/}
                    <div 
                        ref={loadingRef => (this.loadingRef = loadingRef)}
                        style={{"height": "100px", "margin": "1rem"}}
                    >

                        {/*The Loading animation markup*/}
                            <span className="loading" style={loadingfaces}>
                                <h1>
                                    <span>L</span>
                                    <span>o</span>
                                    <span>a</span>
                                    <span>d</span>
                                    <span>i</span>
                                    <span>n</span>
                                    <span>g</span>
                                </h1>
                            </span>
                    </div>

                    {/*This displays the "end of the catalogue" once all 
                    the items have been displayed*/}
                    {this.state.faces.length === 500 ? <p className="end">End of Catalogue</p> : null}
                    
                
            </div>
        )
    }
}

    
ReactDOM.render(<ProductList/>, document.getElementById('root'));
