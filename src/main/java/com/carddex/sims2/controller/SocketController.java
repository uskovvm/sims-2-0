package com.carddex.sims2.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.carddex.sims2.model.Message;
import com.carddex.sims2.model.OutputMessage;

@Controller
public class SocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    //private static final Logger log = LoggerFactory.getLogger(SocketController.class);

    @MessageMapping("/socket")
    @SendTo("/socket")
    public OutputMessage send(Message msg) throws Exception {
        OutputMessage out = new OutputMessage(msg.getFrom(), msg.getText(), new SimpleDateFormat("HH:mm").format(new Date()));
        return out;
    }

}
