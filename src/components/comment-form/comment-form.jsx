import React, {Component, Fragment} from 'react';
import {
    Form,
    Input,
    Rate
} from "element-react";

export default class CommentForm extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {handleInputChange} = this.props
        const {rating, content, s_rating, s_content, d_rating, d_content, sid, did} = this.props.comment
        return (
            <Form model={this.props.comment}>
                {
                    sid ?
                        <Fragment>
                            <span className="comment-title">评价商家：</span>
                            <Form.Item label="评分" labelWidth="120">
                                <Rate value={rating}
                                      showText={true}
                                      disabled={true}
                                      onChange={(val) => handleInputChange(val, 's_rating')}
                                />
                            </Form.Item>
                            <Form.Item label="评价内容" labelWidth="120">
                                <Input value={content}
                                       disabled={true}
                                       onChange={(val) => handleInputChange(val, 's_content')}/>
                            </Form.Item>
                        </Fragment>
                        :
                        (did ?
                                <Fragment>
                                    <span className="comment-title">评价配送员：</span>
                                    <Form.Item label="评分" labelWidth="120">
                                        <Rate value={rating}
                                              showText={true}
                                              disabled={true}
                                              onChange={(val) => handleInputChange(val, 'd_rating')}
                                        />
                                    </Form.Item>
                                    <Form.Item label="评价内容" labelWidth="120">
                                        <Input value={content}
                                               disabled={true}
                                               onChange={(val) => handleInputChange(val, 'd_content')}/>
                                    </Form.Item>
                                </Fragment>
                                :
                                <Fragment>
                                    <span className="comment-title">评价商家：</span>
                                    <Form.Item label="评分" labelWidth="120">
                                        <Rate value={s_rating - 1}
                                              showText={true}
                                              onChange={(val) => handleInputChange(val, 's_rating')}
                                        />
                                    </Form.Item>
                                    <Form.Item label="评价内容" labelWidth="120">
                                        <Input value={s_content}
                                               onChange={(val) => handleInputChange(val, 's_content')}/>
                                    </Form.Item>
                                    <span className="comment-title">评价配送员：</span>
                                    <Form.Item label="评分" labelWidth="120">
                                        <Rate value={d_rating - 1}
                                              showText={true}
                                              onChange={(val) => handleInputChange(val, 'd_rating')}
                                        />
                                    </Form.Item>
                                    <Form.Item label="评价内容" labelWidth="120">
                                        <Input value={d_content}
                                               onChange={(val) => handleInputChange(val, 'd_content')}/>
                                    </Form.Item>
                                </Fragment>
                        )
                }


            </Form>
        )
    }
}