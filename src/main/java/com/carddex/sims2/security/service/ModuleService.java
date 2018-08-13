package com.carddex.sims2.security.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carddex.sims2.model.Module;
import com.carddex.sims2.security.repository.ModuleRepository;

@Service
public class ModuleService {
    @Autowired
    private ModuleRepository moduleRepository;

    public List<Module> loadAllModules() {
        List<Module> modules = moduleRepository.findAll();
        return modules;
    }

}
