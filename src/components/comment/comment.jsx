import React, {Component} from 'react';
import './comment.css'
import {Rate} from "element-react";
import {
    formatDate
} from '../../utils/localStorage'
export default class Comment extends Component {

    render() {
        /*if(!this.props.commentList || this.props.commentList.length <=0){
            return null
        }*/
        /*if(Object.keys(this.props.commentList).length <= 0){
            return null
        }*/
        console.log('?????????',this.props.commentList)
        return (
            <div className="m-comment-list">
                <ul>
                    <li className="comment">
                        {
                            this.props.commentList.map(comment => (
                                <dl className="section" key={comment.cid}>
                                    <dd>
                                        <img src={require(`../../assets/images/${comment.user.avatar_url && comment.user.avatar_url}`)} alt="用户头像"/>
                                    </dd>
                                    <dd>
                                        <h4>{comment.user.u_name}</h4>
                                        <Rate disabled={true} value={comment.rating} showText={true} />
                                        <p className="comment-content">
                                            {comment.content}
                                        </p>
                                    </dd>
                                    <dd className="comment-time">
                                        {formatDate(new Date(comment.create_time), "yyyy-MM-dd hh:mm:ss")}
                                    </dd>
                                </dl>
                            ))
                        }
                    </li>
                </ul>
            </div>
        )
    }
}