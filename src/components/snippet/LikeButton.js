import React, { Component } from 'react';
import CustomButton from '../../util/CustomButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons 
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// Redux
import { connect } from 'react-redux';
import { likeSnippet, unlikeSnippet } from '../../redux/actions/dataActions';

class LikeButton extends Component {
    likedSnippet = () => {
        if(this.props.user.likes && this.props.user.likes.find(like => like.snippetId === this.props.snippetId)) {
            return true
        } else {
            return false
        };
    };
    likeSnippet = () => {
        this.props.likeSnippet(this.props.snippetId);
    };
    unlikeSnippet = () => {
        this.props.unlikeSnippet(this.props.snippetId);
    };
    render() {
        const { authenticated } = this.props.user
        const likeButton = !authenticated ? (
            <Link to="/login">
                <CustomButton tip="Like">
                    <FavoriteBorderIcon color="primary" />
                </CustomButton>
            </Link>
        ) : (
            this.likedSnippet() ? (
                <CustomButton tip="Unlike" onClick={this.unlikeSnippet}>
                    <FavoriteIcon color="primary" />
                </CustomButton>
            ) : (
                <CustomButton tip="Like" onClick={this.likeSnippet}>
                <FavoriteBorderIcon color="primary" />
                </CustomButton>
            )
        );

        return likeButton;
    };
};

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    snippetId: PropTypes.string.isRequired,
    likeSnippet: PropTypes.func.isRequired,
    unlikeSnippet: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    likeSnippet,
    unlikeSnippet
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
