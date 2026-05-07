"use client"
import React from 'react'
import { motion } from 'framer-motion'

const Bookmark = () => {
  return (
    <motion.div whileHover="animate" initial="initial">
      <motion.svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 480" role="img">
        <title>White isometric 3D box with vertical line details</title>
        <desc>Clean white isometric box, three faces, subtle vertical lines on each face</desc>
        <defs>
        
          <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#FDFDFD"/>
          </linearGradient>
          <linearGradient id="gLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="100%" stopColor="#F0F0F0"/>
          </linearGradient>
          <linearGradient id="gRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EBEBEB"/>
            <stop offset="100%" stopColor="#E6E6E6"/>
          </linearGradient>

      
          <motion.clipPath 
            variants={{
              animate: { y: 10 },
              initial: { y: 0 }
            }}
            id="clipTop"
          >
            <polygon points="340,100 530,208 340,316 150,208"/>
          </motion.clipPath>
          
          <clipPath id="clipLeft">
            <polygon points="150,208 150,318 340,426 340,316"/>
          </clipPath>
          <clipPath id="clipRight">
            <polygon points="340,316 530,208 530,318 340,426"/>
          </clipPath>

   
          <filter id="shadow">
            <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#AAAAAA" floodOpacity="0.1"/>
          </filter>
        </defs>

   
        <ellipse cx="340" cy="436" rx="150" ry="14" fill="#BBBBBB" opacity="0.08" />

        <g filter="url(#shadow)">
        
          <polygon points="340,100 530,208 340,316 150,208" fill="url(#gTop)" />
          <polygon points="150,208 150,318 340,426 340,316" fill="url(#gLeft)" />
          <polygon points="340,316 530,208 530,318 340,426" fill="url(#gRight)" />

          <line x1="246" y1="154" x2="246" y2="154" stroke="none" />

         
          <line x1="403" y1="136" x2="213" y2="244" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipTop)" />
          <line x1="466" y1="171" x2="276" y2="279" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipTop)" />

          <line x1="213" y1="244" x2="213" y2="354" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipLeft)" />
          <line x1="276" y1="279" x2="276" y2="389" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipLeft)" />

          <line x1="403" y1="280" x2="403" y2="390" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipRight)" />
          <line x1="466" y1="245" x2="466" y2="354" stroke="#D0D0D0" strokeWidth="0.7" opacity="0.1" clipPath="url(#clipRight)" />

        
          <polyline points="340,100 530,208 340,316 150,208 340,100" fill="none" stroke="#D0D0D0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="150" y1="208" x2="150" y2="318" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="150" y1="318" x2="340" y2="426" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="530" y1="208" x2="530" y2="318" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="530" y1="318" x2="340" y2="426" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="340" y1="316" x2="340" y2="426" stroke="#D0D0D0" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

          <circle cx="340" cy="100" r="3" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="1.5" />
          <circle cx="150" cy="208" r="3" fill="#FBFBFB" stroke="#D0D0D0" strokeWidth="1.5" />
          <circle cx="530" cy="208" r="3" fill="#FBFBFB" stroke="#D0D0D0" strokeWidth="1.5" />
          <circle cx="150" cy="318" r="3" fill="#F5F5F5" stroke="#D0D0D0" strokeWidth="1.5" />
          <circle cx="530" cy="318" r="3" fill="#F5F5F5" stroke="#D0D0D0" strokeWidth="1.5" />
          <circle cx="340" cy="426" r="3" fill="#F0F0F0" stroke="#D0D0D0" strokeWidth="1.5" />
        </g>
      </motion.svg>
    </motion.div>
  )
}

export default Bookmark