import React from 'react';
export default function CartItem(props) {
    return (
        <tr>
            <td className="checkbox"><input className="check-one check" checked={props.isChecked} onChange={props.handleCheck} type="checkbox"/></td>
            <td className="goods"><img src={require(`../../assets/images/${props.img}`)} alt="商品图片"/><span>{props.name}</span></td>
            <td className="price">{props.price}</td>
            <td className="count">
                <span className="reduce" onClick={props.handleReduce}>
                    {
                        props.count >= 1 ? '-' : ''
                    }
                </span>
                <input className="count-input" type="text" value={props.count} onChange={props.handleChange}/>
                <span className="add" onClick={props.handlePlus}>+</span></td>
            <td className="subtotal">{props.totalPrice}</td>
            <td className="operation"><span className="delete" onClick={props.handleRemove}>删除</span></td>
        </tr>
    )
}