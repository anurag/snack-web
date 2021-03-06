import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';

type Props = {
  onResize: () => void;
  children: React.ReactNode;
};

export default class ResizeDetector extends React.Component<Props> {
  componentDidMount() {
    this._horizontal &&
      this._horizontal.contentWindow &&
      this._horizontal.contentWindow.addEventListener('resize', this._handleResize);

    this._vertical &&
      this._vertical.contentWindow &&
      this._vertical.contentWindow.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    this._horizontal &&
      this._horizontal.contentWindow &&
      this._horizontal.contentWindow.removeEventListener('resize', this._handleResize);

    this._vertical &&
      this._vertical.contentWindow &&
      this._vertical.contentWindow.removeEventListener('resize', this._handleResize);
  }

  _handleResize = () => this.props.onResize();

  _horizontal: HTMLIFrameElement | null = null;
  _vertical: HTMLIFrameElement | null = null;

  render() {
    return (
      <div className={css(styles.container)}>
        {/* pointer-events: none is not working properly on EDGE, so we render 2 iframes to detect resize instead of one iframe covering the entire editor */}
        <iframe
          ref={c => (this._horizontal = c)}
          className={css(styles.phantom, styles.horizontal)}
        />
        <iframe ref={c => (this._vertical = c)} className={css(styles.phantom, styles.vertical)} />
        {this.props.children}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
    position: 'relative',
  },
  phantom: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    opacity: 0,
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: 1,
  },
});
