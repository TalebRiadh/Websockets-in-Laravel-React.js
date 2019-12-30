import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './Example.css'



export default class Example extends React.Component {
    constructor(props) {

        super(props);
        this.getComments = this.getComments.bind(this);
        this.mapComments = this.mapComments.bind(this);
        this.submitBtn = this.submitBtn.bind(this);

        this.state = {
            user: JSON.parse(props.user) ,
            post: JSON.parse(props.post),
            comments: [],
            commentBox: '',
        };


    };
    componentDidMount() {
        console.log(this.state.post.id)
        this.getComments()
        this.mapComments()
        this.listen()
    }
    mapComments(){
      const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',hour:'numeric', minute:'numeric' };
      const {comments} = this.state

      const commentsNode = comments.map((comment, index) => (
        <div className="media"  key={index}>
            <div className="media-left" >
                <a href="#">
                    <img className="media-object" src="http://placeimg.com/80/80" alt="..." />
                </a>
            </div>
            <div  className="media-body">
                <h4 className="media-heading">{comment.user.name} said...</h4>
                <p>
                    {comment.body}
                </p>
                <span >
                    on {new Date(comment.created_at).toLocaleDateString('en-FR', DATE_OPTIONS)}

                </span>
            </div>
        </div>
      ))
        return commentsNode
    }
    getComments(){
        axios.get(`/api/posts/${this.state.post.id}/comments`)
            .then((res)=>{
                this.setState({
                  comments:res.data
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    postComment(){
        axios.post(`/api/posts/${this.state.post.id}/comment`,
            {
                api_token: this.state.user.api_token,
                body: this.state.commentBox
            })
            .then((res)=>{
                let {comments} = this.state
                let newCom = res.data
                let newComs = comments.concat([newCom]).reverse()
            this.setState({
                comments: newComs,
              })
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    submitBtn(){
            if(this.state.commentBox !== null){
                this.postComment()
                this.setState({
                    commentBox: ''
                })
            }

        }
    listen(){
      Echo.channel(`post.${this.state.post.id}`)
        .listen('NewComment', (comment)=>{
          let {comments} = this.state
          let newComs = comments.concat([comment]).reverse()
          this.setState({
                comments: newComs,
                })
        })
    }
    render() {
        return(
            <div>
            {this.state.user ? (
              <div className="div-com">
                  <textarea className="form-control" rows="3" name="body" placeholder="Leave a comment" value={this.state.commentBox} onChange={(e)=> this.setState({commentBox: e.target.value})}></textarea>
                  <button className="btn btn-success button" onClick={()=>this.submitBtn()} >Save Comment</button>
              </div>
            ):(
              <a className='btn' href='/login'>Login to sumbit a comment</a>
            )}
                {this.mapComments()}
            </div>
                )
    }

}
if (document.getElementById('example')) {
    const element = document.getElementById('example')

    // create new props object with element's data-attributes
    // result: {tsId: "1241"}
    const props = Object.assign({}, element.dataset)

    // render element with props (using spread)
    ReactDOM.render(<Example {...props}/>, element);
}
