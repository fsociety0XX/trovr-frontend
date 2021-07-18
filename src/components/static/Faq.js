import React, { useState } from 'react'
import { Accordion, Input, Form } from 'semantic-ui-react'
import Highlighter from 'react-highlight-words'
import Search from '../../svgs/Search'
import * as placeholder from '../../utils/placeholders'

const Faq = () => {
  const [activeIndex, setactiveIndex] = useState(0)
  const [searchString, setSeachString] = useState('')

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setactiveIndex(newIndex)
  }
  const string =
    'Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet,consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit,sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, conse-ctetur.Lorem ipsum dolor sit amet, consectetur adipis- icng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.'

  const searchText = (e) => {
    setSeachString(e.target.value)
  }

  const accordion = () => (
    <Accordion>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="How can I connect social accounts?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 1}
        index={1}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="How to earn rewards?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="How can I redeem the voucher?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 2}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>
      <Accordion.Title
        active={activeIndex === 3}
        index={3}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="Which locations allow bottle recycling?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 3}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>
      <Accordion.Title
        active={activeIndex === 4}
        index={4}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="How to earn points?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 4}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>
      <Accordion.Title
        active={activeIndex === 5}
        index={5}
        onClick={handleClick}
      >
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchString]}
          autoEscape
          textToHighlight="How can I get update my password?"
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 5}>
        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>

        <p>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[searchString]}
            autoEscape
            textToHighlight={string}
          />
          ,
        </p>
      </Accordion.Content>
    </Accordion>
  )

  return (
    <div className="faq-tab">
      <div className="searchbox">
        <label htmlFor="searchFaq">How can we help you?</label>
        <Form.Field>
          <Input
            name="searchKeyword"
            iconPosition="left"
            placeholder={placeholder.searchKeyword}
            id="searchFaq"
            onChange={searchText}
          >
            <Search />
            <input />
          </Input>
        </Form.Field>
      </div>
      {accordion()}
    </div>
  )
}

export default Faq
