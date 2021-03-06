/** @jsx jsx */
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import { lighten } from 'polished'

import { CONTAINER_HEIGHT } from './LinkCreator'
import copyLogoSVG from '../assets/copy.svg'
import { Palette } from '../constants'
import { ShowToast } from '../hooks/useCopyClipboardToast'
import { SCROLL_BAR_WIDTH } from '../styles/GlobalStyles'
import { copyToClipboard } from '../utils/copyToClipboard'

const styles = {
  wrapper: css`
    margin-top: 20px;
    max-height: ${CONTAINER_HEIGHT * 4}px; // Number of rows before scroll (4)
    overflow-y: hidden;
    overflow-x: hidden;

    &.custom-scroll {
      overflow-y: scroll;

      ::-webkit-scrollbar {
        width: ${SCROLL_BAR_WIDTH}px;
      }

      ::-webkit-scrollbar-track {
        background: ${Palette.shade3};
      }

      ::-webkit-scrollbar-thumb {
        background: ${Palette.shade2};
      }
    }
  `,
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${Palette.secondary};
    height: ${CONTAINER_HEIGHT}px;
    position: relative;

    &.can-delete {
      &:hover {
        .close-icon {
          display: block;
        }
      }
    }
  `,
  link: css`
    display: inline-block;
    text-decoration: underline;
    font-weight: bold;
    width: 80%;
    text-align: center;
    color: ${Palette.background};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 750px) {
      text-align: left;
      padding-left: 20px;
    }

    @media (max-width: 550px) {
      font-size: 14px;
    }
  `,
  linkWithScroll: css`
    width: 81.5%;
  `,
  close: css`
    color: ${Palette.background};
    font-size: 22px;
    position: absolute;
    left: 15px;
    top: 12px;
    cursor: pointer;
    display: none;
    transition: transform 0.2s ease-in-out;

    @media (max-width: 750px) {
      left: 5px;
      top: 15px;
      font-size: 16px;
    }

    &:hover {
      color: ${Palette.primary};
      transform: scale(1.3);
      transition: transform 0.2s ease-in-out;
    }
  `,
  button: css`
    display: inline-block;
    text-transform: uppercase;
    font-size: 15px;
    border: none;
    padding: 7px 13px 5px 13px;
    height: ${CONTAINER_HEIGHT}px;
    background: ${Palette.secondary};
    cursor: pointer;
    flex: 1;
    transform: scale(0.95);
    position: relative;
    left: 1px;

    @media (max-width: 550px) {
      img {
      }
    }

    &:hover {
      background: ${lighten(0.05, Palette.secondary)};
    }
  `,
  buttonWithScroll: css`
    padding-left: 29px;
  `,
  underline: css`
    text-decoration: underline;
    margin-left: 5px;
  `,
}

interface Props {
  links: string[]
  canDeleteItem: boolean
  showToast: ShowToast
  onLinkDelete?: (url: string, links: string[]) => void
}

const Links: React.FC<Props> = ({ links, canDeleteItem, showToast, onLinkDelete }) => {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [hasScroll, setHasScroll] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (divRef.current) {
      const scroll = divRef.current.scrollHeight > divRef.current.clientHeight
      setHasScroll(scroll)
    }
  }, [links.length])

  return (
    <div css={styles.wrapper} className={canDeleteItem && hasScroll ? 'custom-scroll' : ''} ref={divRef}>
      {links
        .map(link => [link, link.replace(/^https?:\/\//, '')])
        .map(([link, prettyLink]) => (
          <div key={link} css={styles.container} className={canDeleteItem ? 'can-delete' : ''}>
            <span
              css={css`
                ${styles.link};
                ${hasScroll ? styles.linkWithScroll : ''}
              `}
            >
              {prettyLink}
            </span>
            <button
              css={css`
                ${styles.button};
                ${hasScroll ? styles.buttonWithScroll : ''}
              `}
              onClick={() => copyToClipboard(prettyLink, link, showToast)}
            >
              <img alt="copy logo" src={copyLogoSVG} />
            </button>
            <span
              role="button"
              css={styles.close}
              className="close-icon"
              onClick={() => onLinkDelete && onLinkDelete(link, links)}
            >
              ⅹ
            </span>
          </div>
        ))}
    </div>
  )
}

export default Links
